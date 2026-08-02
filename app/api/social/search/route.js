import { getUserFromRequest } from "../../../../lib/auth";
import { getProfile, searchUsersByUsername } from "../../../../lib/social";

// GET ?q=... — 16+ discovery only. Under-16 accounts can't use this (checked here) and
// are never returned in results regardless of who's searching (checked in lib/social.js).
export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!user) return Response.json({ error: "Please sign in." }, { status: 401 });

  try {
    const profile = await getProfile(user.id);
    if ((profile?.age_band || "under16") !== "16plus") {
      return Response.json({ error: "Search is only available for 16+ accounts — add friends with their invite code instead." }, { status: 403 });
    }
    const { searchParams } = new URL(req.url);
    const results = await searchUsersByUsername(user.id, searchParams.get("q") || "");
    return Response.json({ results });
  } catch (e) {
    console.error(e);
    return Response.json({ error: e.message || "Search failed." }, { status: 500 });
  }
}
