import specPilot from "../../../data/spec-pilot.json";
import { topicStats, weakTopics, allAttempts } from "../../../lib/store";
import { getUserFromRequest } from "../../../lib/auth";

const refTitles = {};
for (const c of specPilot.clusters) for (const r of c.refs) refTitles[r.ref] = r.title;

export async function GET(req) {
  const user = await getUserFromRequest(req);
  const [stats, weak, attempts] = await Promise.all([
    topicStats(user?.id),
    weakTopics(user?.id),
    allAttempts(user?.id),
  ]);

  const last7 = attempts.filter(a => Date.now() - new Date(a.ts).getTime() < 7 * 86400e3);
  const earned = last7.reduce((s, a) => s + a.score, 0);
  const avail = last7.reduce((s, a) => s + a.outOf, 0);

  return Response.json({
    signedIn: Boolean(user),
    email: user?.email || null,
    week: { sessions: last7.length, accuracy: avail ? earned / avail : null },
    topics: stats.map(t => ({ ...t, title: refTitles[t.ref] || t.ref })),
    focus: weak.slice(0, 2).map(t => ({ ...t, title: refTitles[t.ref] || t.ref })),
    recent: attempts.slice(0, 10).map(a => ({
      ts: a.ts, question: a.question, score: a.score, outOf: a.outOf,
      topic: refTitles[a.specRef] || a.specRef,
    })),
  });
}
