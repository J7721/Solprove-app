import { markAttempt } from "../../../lib/marking";
import { recordAttempt, allAttempts } from "../../../lib/store";
import { getUserFromRequest } from "../../../lib/auth";
import { isSubscribed, billingEnabled } from "../../../lib/billing";
import bank from "../../../data/question-bank.json";

const FREE_MARKS = 5; // signed-in accounts get this many free marks before the paywall

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);

    // Paywall gate (only once billing is configured, and only for signed-in accounts)
    if (user && billingEnabled() && !(await isSubscribed(user.email))) {
      const used = (await allAttempts(user.id)).length;
      if (used >= FREE_MARKS) {
        return Response.json(
          { needsSubscription: true, error: `You've used your ${FREE_MARKS} free marked questions.` },
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
