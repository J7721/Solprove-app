import { getUserFromRequest } from "../../../lib/auth";
import { getProfile, getOrCreateInviteCode, listFriends, addFriendByCode, addFriendById, removeFriend } from "../../../lib/social";

// GET — my profile (age band, invite code, streak) + friends list
export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!user) return Response.json({ error: "Please sign in." }, { status: 401 });

  try {
    const [profile, inviteCode, friends] = await Promise.all([
      getProfile(user.id),
      getOrCreateInviteCode(user.id),
      listFriends(user.id),
    ]);
    return Response.json({
      me: {
        ageBand: profile?.age_band || "under16",
        statsPublic: Boolean(profile?.stats_public),
        streak: profile?.streak_count || 0,
        inviteCode,
      },
      friends,
    });
  } catch (e) {
    console.error(e);
    return Response.json({ error: e.message || "Couldn't load friends." }, { status: 500 });
  }
}

// POST — add a friend, either { code } (anyone) or { userId } (16+ discovery only)
export async function POST(req) {
  const user = await getUserFromRequest(req);
  if (!user) return Response.json({ error: "Please sign in." }, { status: 401 });

  try {
    const { code, userId } = await req.json();
    const result = code ? await addFriendByCode(user.id, code) : await addFriendById(user.id, userId);
    if (result.error) return Response.json({ error: result.error }, { status: 400 });
    return Response.json(result);
  } catch (e) {
    console.error(e);
    return Response.json({ error: e.message || "Couldn't add friend." }, { status: 500 });
  }
}

// DELETE — unfriend, { friendId }
export async function DELETE(req) {
  const user = await getUserFromRequest(req);
  if (!user) return Response.json({ error: "Please sign in." }, { status: 401 });

  try {
    const { friendId } = await req.json();
    await removeFriend(user.id, friendId);
    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: e.message || "Couldn't remove friend." }, { status: 500 });
  }
}
