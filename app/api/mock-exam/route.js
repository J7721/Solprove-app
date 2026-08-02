// Timed mock exam: picks a spread of original, board-neutral questions from the
// question bank (never real past-paper questions — see data/question-bank.json note),
// then marks every answer with the same two-stage examiner pipeline as single-question
// marking, reusing the red-pen step_index/y linking so the frontend can overlay marks
// on each answer photo exactly like the normal workspace does.
import bank from "../../../data/question-bank.json";
import { markAttempt } from "../../../lib/marking";
import { recordAttempt, allAttempts } from "../../../lib/store";
import { getUserFromRequest } from "../../../lib/auth";
import { isSubscribed, billingEnabled } from "../../../lib/billing";
import { touchStreak } from "../../../lib/social";

const FREE_MARKS_PER_DAY = 5; // same daily pool as single-question marking — a mock exam spends from it too

function pickPaper(tier, count) {
  const tierOk = (q) => q.tier === "both" || q.tier === tier;
  const pool = bank.questions.filter(tierOk);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  // Spread across topic clusters first so a paper isn't 5 algebra questions in a row,
  // then fill any remaining slots from whatever's left.
  const seenClusters = new Set();
  const spread = [];
  for (const q of shuffled) {
    if (!seenClusters.has(q.cluster)) { seenClusters.add(q.cluster); spread.push(q); }
  }
  const rest = shuffled.filter((q) => !spread.includes(q));
  return [...spread, ...rest].slice(0, count);
}

// GET /api/mock-exam?tier=foundation&count=8 — starts a paper
export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return Response.json({ error: "Please sign in to start a mock exam." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const tier = searchParams.get("tier") === "higher" ? "higher" : "foundation";
  const count = Math.min(20, Math.max(3, parseInt(searchParams.get("count") || "8", 10)));

  if (billingEnabled() && !(await isSubscribed(user.email))) {
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const usedToday = (await allAttempts(user.id)).filter((a) => new Date(a.ts) >= todayStart).length;
    const remaining = FREE_MARKS_PER_DAY - usedToday;
    if (remaining < count) {
      return Response.json(
        {
          needsSubscription: true,
          error: `A ${count}-question mock exam needs ${count} marked questions, but you've only got ${Math.max(0, remaining)} free marks left today. Upgrade for unlimited, or come back tomorrow.`,
        },
        { status: 402 }
      );
    }
  }

  const paper = pickPaper(tier, count);
  const totalMarks = paper.reduce((s, q) => s + q.marks, 0);

  return Response.json({
    tier,
    paper: paper.map((q) => ({ id: q.id, question: q.question, marks: q.marks, spec_ref: q.spec_ref, cluster: q.cluster })),
    totalMarks,
    suggestedMinutes: Math.max(10, Math.round(totalMarks * 1.5)), // roughly mirrors real GCSE pacing (~1.5 min/mark)
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
