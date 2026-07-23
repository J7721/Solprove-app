import { markAttempt } from "../../../lib/marking";
import { recordAttempt, allAttempts } from "../../../lib/store";
import { getUserFromRequest } from "../../../lib/auth";
import { isSubscribed, billingEnabled } from "../../../lib/billing";
import bank from "../../../data/question-bank.json";

const FREE_MARKS_PER_DAY = 3; // signed-in accounts get this many free marks per day before the paywall

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);

    // Paywall gate (only once billing is configured, and only for signed-in accounts)
    if (user && billingEnabled() && !(await isSubscribed(user.email))) {
      // Daily reset: only count marks from the current UTC calendar day. (Simplification —
      // resets at midnight UTC regardless of the student's own timezone.)
      const todayStart = new Date();
      todayStart.setUTCHours(0, 0, 0, 0);
      const usedToday = (await allAttempts(user.id)).filter(a => new Date(a.ts) >= todayStart).length;
      if (usedToday >= FREE_MARKS_PER_DAY) {
        return Response.json(
          { needsSubscription: true, error: `You've used your ${FREE_MARKS_PER_DAY} free marked questions for today — come back tomorrow, or upgrade for unlimited.` },
          { status: 402 }
        );
      }
    }
    const { question, attempt, tier, questionId, attemptImageBase64, attemptImageType } = await req.json();
    if (!question || (!attempt && !attemptImageBase64)) {
      return Response.json({ error: "Need the question, and either typed working or a photo of the attempt." }, { status: 400 });
    }

    const bankQ = questionId ? bank.questions.find(q => q.id === questionId) : null;

    const result = await markAttempt({
      question,
      attempt,
      tier,
      rubric: bankQ?.rubric,
      attemptImageBase64,
      attemptImageType,
    });

    const mistakeTypes = (result.awards || [])
      .filter(a => !a.earned && a.mistake_type)
      .map(a => a.mistake_type);

    await recordAttempt({
      userId: user?.id,
      questionId: bankQ?.id,
      specRef: bankQ?.spec_ref || result.spec_ref,
      score: result.score,
      outOf: result.out_of,
      question,
      mistakeTypes,
    });

    return Response.json(result);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Marking failed. Please try again." }, { status: 500 });
  }
}
