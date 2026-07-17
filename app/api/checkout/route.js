import { getStripe, billingEnabled } from "../../../lib/billing";
import { getUserFromRequest } from "../../../lib/auth";

export async function POST(req) {
  try {
    if (!billingEnabled()) {
      return Response.json({ error: "Billing isn't configured yet." }, { status: 400 });
    }
    const user = await getUserFromRequest(req);
    if (!user) return Response.json({ error: "Please sign in first." }, { status: 401 });

    const origin = req.headers.get("origin") || "http://localhost:3000";
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      subscription_data: { trial_period_days: 7 },
      allow_promotion_codes: true,
      success_url: `${origin}/app?subscribed=1`,
      cancel_url: `${origin}/app?subscribed=0`,
    });

    return Response.json({ url: session.url });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Could not start checkout." }, { status: 500 });
  }
}
