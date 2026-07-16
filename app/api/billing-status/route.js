import { getUserFromRequest } from "../../../lib/auth";
import { isSubscribed, billingEnabled } from "../../../lib/billing";

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!user) return Response.json({ signedIn: false, subscribed: false, billingEnabled: billingEnabled() });
  const subscribed = await isSubscribed(user.email);
  return Response.json({ signedIn: true, subscribed, billingEnabled: billingEnabled() });
}
