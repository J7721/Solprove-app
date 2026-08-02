// Timed mock exam: picks a spread of original, board-neutral questions from the
// question bank (never real past-paper questions — see data/question-bank.json note),
// then marks every answer with the same two-stage examiner pipeline as single-question
// marking, reusing the red-pen step_index/y linking so the frontend can overlay marks
// on each answer photo exactly like the normal workspace does.
import bank from "../../../data/question-bank.json";
import { markAttempt } from "../../../lib/marking";
import { recordAttempt } from "../../../lib/store";
import { getUserFromRequest } from "../../../lib/auth";
import { isSubscribed, billingEnabled } from "../../../lib/billing";
import { touchStreak } from "../../../lib/social";

// Mirrors the real GCSE Maths structure: 3 papers per sitting, paper 1 is
// non-calculator, papers 2 and 3 are calculator. Every question in the bank is
// pre-assigned to exactly one of the three (see data/question-bank.json's
// "paper_group" field), so the three papers never share a question — same as a
// real exam board's 3-paper set never repeats a question across papers.
const PAPER_LABELS = { 1: "Paper 1 — Non-calculator", 2: "Paper 2 — Calculator", 3: "Paper 3 — Calculator" };

function pickPaper(tier, paperNum) {
  const pool = bank.questions.filter((q) => (q.tier === "both" || q.tier === tier) && q.paper_group === paperNum);
  // Spread across topic clusters first so the paper isn't clumped by topic, same shuffle
  // approach as before, but now we return everything assigned to this paper rather than
  // truncating to a fixed count — length reflects however much bank content exists so far.
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const seenClusters = new Set();
  const spread = [];
  for (const q of shuffled) {
    if (!seenClusters.has(q.cluster)) { seenClusters.add(q.cluster); spread.push(q); }
  }
  const rest = shuffled.filter((q) => !spread.includes(q));
  return [...spread, ...rest];
}

// GET /api/mock-exam?tier=foundation&paper=1 — starts a paper (1, 2, or 3)
export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return Response.json({ error: "Please sign in to start a mock exam." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const tier = searchParams.get("tier") === "higher" ? "higher" : "foundation";
  const paperNum = [1, 2, 3].includes(Number(searchParams.get("paper"))) ? Number(searchParams.get("paper")) : 1;

  // Mock exams are a Premium-only feature — no free allowance, unlike single-question
  // marking. Any paper requires an active subscription.
  if (billingEnabled() && !(await isSubscribed(user.email))) {
    return Response.json(
      { needsSubscription: true, error: "Mock exams are a Premium feature. Upgrade to unlock timed mock exams, plus unlimited single-question marking." },
      { status: 402 }
    );
  }

  const paper = pickPaper(tier, paperNum);
  if (!paper.length) {
    return Response.json({ error: "Not enough questions banked for this paper yet — check back as the question bank grows." }, { status: 400 });
  }
  const totalMarks = paper.reduce((s, q) => s + q.marks, 0);

  return Response.json({
    tier,
    paperNum,
    paperLabel: PAPER_LABELS[paperNum],
    calculatorAllowed: paperNum !== 1,
    paper: paper.map((q) => ({ id: q.id, question: q.question, marks: q.marks, spec_ref: q.spec_ref, cluster: q.cluster })),
    totalMarks,
    suggestedMinutes: Math.max(15, Math.round(totalMarks * 1.125)), // same per-mark pacing as a real 90-min/80-mark GCSE paper
  });
}

// POST /api/mock-exam — submits every answer for marking at once
export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return Response.json({ error: "Please sign in to submit your mock exam." }, { status: 401 });
    }

    const { tier, answers } = await req.json();
    if (!Array.isArray(answers) || !answers.length) {
      return Response.json({ error: "No answers submitted." }, { status: 400 });
    }

    const results = await Promise.all(
      answers.map(async (a) => {
        const bankQ = bank.questions.find((q) => q.id === a.questionId);
        if (!bankQ) return null;

        if (!a.attempt && !a.attemptImageBase64) {
          return {
            questionId: a.questionId, question: bankQ.question, marks: bankQ.marks,
            skipped: true, score: 0, out_of: bankQ.marks, awards: [],
            summary: "No answer given — worth going back to this topic in practice mode.",
          };
        }

        const result = await markAttempt({
          question: bankQ.question, attempt: a.attempt, tier, rubric: bankQ.rubric,
          attemptImageBase64: a.attemptImageBase64, attemptImageType: a.attemptImageType,
        });
        const mistakeTypes = (result.awards || []).filter((x) => !x.earned && x.mistake_type).map((x) => x.mistake_type);

        await recordAttempt({
          userId: user.id, questionId: bankQ.id, specRef: bankQ.spec_ref,
          score: result.score, outOf: result.out_of, question: bankQ.question, mistakeTypes,
        });

        return {
          questionId: a.questionId, question: bankQ.question, marks: bankQ.marks,
          ...result,
          attemptImageBase64: a.attemptImageBase64 || null, attemptImageType: a.attemptImageType || null,
        };
      })
    );

    const clean = results.filter(Boolean);
    const totalScore = clean.reduce((s, r) => s + (r.score || 0), 0);
    const totalOutOf = clean.reduce((s, r) => s + (r.out_of || 0), 0);

    try { await touchStreak(user.id); } catch (e) { console.error("streak update failed:", e.message); }

    return Response.json({ results: clean, totalScore, totalOutOf });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Marking the mock exam failed. Please try again." }, { status: 500 });
  }
}
