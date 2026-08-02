import { getUserFromRequest } from "../../../../lib/auth";
import { updateSettings } from "../../../../lib/social";

// POST — a parent/guardian updates their child's age band and/or stats-sharing preference.
// age_band defaults to "under16" (the safer option) and must be deliberately changed here.
export async function POST(req) {
  const user = await getUserFromRequest(req);
  if (!user) return Response.json({ error: "Please sign in." }, { status: 401 });

  try {
    const { ageBand, statsPublic } = await req.json();
    if (ageBand && ageBand !== "under16" && ageBand !== "16plus") {
      return Response.json({ error: "Invalid age band." }, { status: 400 });
    }
    await updateSettings(user.id, { ageBand, statsPublic });
    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: e.message || "Couldn't update settings." }, { status: 500 });
  }
}
