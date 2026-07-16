// Stripe helpers. Webhook-free design for the beta:
// we simply ask Stripe "does this email have an active/trialing subscription?"
import Stripe from "stripe";

let stripe = null;
export function getStripe() {
  if (!stripe) stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripe;
}

export function billingEnabled() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID);
}

// Small in-memory cache so we don't hit Stripe on every single mark
const cache = new Map(); // email -> { subscribed, at }
const TTL = 60 * 1000;

export async function isSubscribed(email) {
  if (!billingEnabled() || !email) return false;
  const hit = cache.get(email);
  if (hit && Date.now() - hit.at < TTL) return hit.subscribed;

  let subscribed = false;
  try {
    const customers = await getStripe().customers.list({ email, limit: 5 });
    for (const c of customers.data) {
      const subs = await getStripe().subscriptions.list({ customer: c.id, status: "all", limit: 10 });
      if (subs.data.some(s => ["active", "trialing"].includes(s.status))) { subscribed = true; break; }
    }
  } catch (e) {
    console.error("Stripe check failed:", e.message);
  }
  cache.set(email, { subscribed, at: Date.now() });
  return subscribed;
}
