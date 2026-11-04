import bank from "../../../data/question-bank.json";
import specPilot from "../../../data/spec-pilot.json";
import { topicStats, weakTopics, overallStats, mistakeBreakdown } from "../../../lib/store";
import { getUserFromRequest } from "../../../lib/auth";
import { estimateGrade } from "../../../lib/grade";

const refTitles = {};
for (const c of specPilot.clusters) for (const r of c.refs) refTitles[r.ref] = r.title;

function pickQuestion(tier, weak) {
  const tierOk = q => q.tier === "both" || q.tier === tier;
  for (const w of weak) {
    const opts = bank.questions.filter(q => q.spec_ref === w.ref && tierOk(q));
    if (opts.length) return opts[Math.floor(Math.random() * opts.length)];
  }
  const opts = bank.questions.filter(tierOk);
  return opts[Math.floor(Math.random() * opts.length)];
}

export async function POST(req) {
  const user = await getUserFromRequest(req);
  const { tier } = await req.json().catch(() => ({}));
  // Guests can get a practice question, but progress requires a verified user ID.
  // The store treats an omitted ID as an unfiltered query.
  const [weak, stats, overall, mistakeDNA] = user?.id
    ? await Promise.all([
        weakTopics(user.id),
        topicStats(user.id),
        overallStats(user.id),
        mistakeBreakdown(user.id),
      ])
    : [[], [], { attempts: 0, earned: 0, available: 0, accuracy: null }, []];
  const q = pickQuestion(tier || "foundation", weak);

  return Response.json({
    progress: stats.map(t => ({ ...t, title: refTitles[t.ref] || t.ref })),
    weakTopics: weak.map(t => ({ ...t, title: refTitles[t.ref] || t.ref })),
    overall,
    grade: estimateGrade(overall.accuracy, overall.attempts),
    mistakeDNA,
    question: q ? { id: q.id, question: q.question, marks: q.marks, spec_ref: q.spec_ref, tier: q.tier } : null,
  });
}
