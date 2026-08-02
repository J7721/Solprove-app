// Friends, streaks, and friend-only messaging.
//
// Always talks to the real Supabase project (never the local JSON-file fallback) — this
// feature is inherently multi-account, so testing it meaningfully needs real signed-up
// users either way. Requires SUPABASE_SERVICE_ROLE_KEY to be set.
//
// SAFETY DESIGN (do not loosen without re-checking UK Online Safety Act / Children's
// Wellbeing and Schools Act rules for under-16s):
//   - age_band defaults to "under16" — the safer option — until a parent changes it.
//   - under-16 accounts can ONLY be added as a friend via a private invite code they
//     share themselves. They are never returned by username search, regardless of who
//     is searching, and they cannot use search themselves.
//   - "16plus" accounts can be found by username search, by other 16plus accounts only.
//   - messaging only works between existing friends, never strangers.
//   - links are stripped from messages; block + report are always available.
import { createClient } from "@supabase/supabase-js";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supa = null;
function db() {
  if (!supa) {
    if (!SUPA_URL || !SUPA_SERVICE) throw new Error("Supabase isn't configured — friends & streaks needs a real database.");
    supa = createClient(SUPA_URL, SUPA_SERVICE);
  }
  return supa;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function isUuid(v) { return typeof v === "string" && UUID_RE.test(v); }

function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I — easy to read out loud
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export async function getProfile(userId) {
  const { data } = await db().from("profiles")
    .select("id, username, avatar_url, age_band, stats_public, streak_count, last_active_date, invite_code")
    .eq("id", userId).maybeSingle();
  return data;
}

export async function getOrCreateInviteCode(userId) {
  const existing = await getProfile(userId);
  if (existing?.invite_code) return existing.invite_code;
  for (let i = 0; i < 5; i++) {
    const code = randomCode();
    const { error } = await db().from("profiles").update({ invite_code: code }).eq("id", userId).is("invite_code", null);
    if (!error) return code;
  }
  // Extremely unlikely fallback if we kept colliding
  const code = `${randomCode()}${Math.floor(Math.random() * 10)}`;
  await db().from("profiles").update({ invite_code: code }).eq("id", userId);
  return code;
}

export async function updateSettings(userId, { ageBand, statsPublic }) {
  const patch = {};
  if (ageBand === "under16" || ageBand === "16plus") patch.age_band = ageBand;
  if (typeof statsPublic === "boolean") patch.stats_public = statsPublic;
  if (!Object.keys(patch).length) return;
  await db().from("profiles").update(patch).eq("id", userId);
}

// Call whenever the student marks a question — bumps the daily streak, once per calendar day.
export async function touchStreak(userId) {
  const profile = await getProfile(userId);
  if (!profile) return;
  const today = new Date().toISOString().slice(0, 10);
  if (profile.last_active_date === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newStreak = profile.last_active_date === yesterday ? (profile.streak_count || 0) + 1 : 1;
  await db().from("profiles").update({ streak_count: newStreak, last_active_date: today }).eq("id", userId);
}

async function isBlockedEitherWay(userId, otherId) {
  const { data } = await db().from("blocks").select("blocker_id")
    .or(`and(blocker_id.eq.${userId},blocked_id.eq.${otherId}),and(blocker_id.eq.${otherId},blocked_id.eq.${userId})`);
  return Boolean(data?.length);
}

export async function addFriendByCode(userId, rawCode) {
  const code = (rawCode || "").toUpperCase().trim();
  if (!code) return { error: "Enter an invite code first." };
  const { data: target } = await db().from("profiles").select("id, username, avatar_url").eq("invite_code", code).maybeSingle();
  if (!target) return { error: "That invite code doesn't match anyone — double check it with your friend." };
  if (target.id === userId) return { error: "That's your own invite code." };
  if (await isBlockedEitherWay(userId, target.id)) return { error: "Couldn't add this friend." };
  await db().from("friendships").upsert(
    [{ user_id: userId, friend_id: target.id }, { user_id: target.id, friend_id: userId }],
    { onConflict: "user_id,friend_id" }
  );
  return { friend: target };
}

export async function addFriendById(userId, targetId) {
  if (!isUuid(targetId)) return { error: "Invalid user." };
  const { data: target } = await db().from("profiles").select("id, username, avatar_url, age_band").eq("id", targetId).maybeSingle();
  if (!target) return { error: "User not found." };
  if (target.age_band !== "16plus") return { error: "This user can only be added using their invite code." };
  if (await isBlockedEitherWay(userId, target.id)) return { error: "Couldn't add this friend." };
  await db().from("friendships").upsert(
    [{ user_id: userId, friend_id: target.id }, { user_id: target.id, friend_id: userId }],
    { onConflict: "user_id,friend_id" }
  );
  return { friend: target };
}

export async function removeFriend(userId, friendId) {
  if (!isUuid(friendId)) return;
  await db().from("friendships").delete()
    .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`);
}

export async function blockUser(userId, targetId) {
  if (!isUuid(targetId)) return { error: "Invalid user." };
  await db().from("blocks").upsert({ blocker_id: userId, blocked_id: targetId }, { onConflict: "blocker_id,blocked_id" });
  await removeFriend(userId, targetId);
  return { ok: true };
}

export async function reportUser(userId, targetId, reason) {
  if (!isUuid(targetId)) return { error: "Invalid user." };
  await db().from("reports").insert({ reporter_id: userId, reported_id: targetId, reason: (reason || "").slice(0, 500) });
  return { ok: true };
}

export async function listFriends(userId) {
  const { data: rows } = await db().from("friendships").select("friend_id").eq("user_id", userId);
  const ids = (rows || []).map((r) => r.friend_id);
  if (!ids.length) return [];
  const { data: profiles } = await db().from("profiles")
    .select("id, username, avatar_url, stats_public, streak_count, last_active_date").in("id", ids);
  return (profiles || []).map((p) => ({
    id: p.id,
    username: p.username,
    avatar_url: p.avatar_url,
    statsShared: p.stats_public,
    streak: p.stats_public ? p.streak_count : null,
    lastActive: p.stats_public ? p.last_active_date : null,
  }));
}

// 16+ discovery only. Never returns under-16 profiles, regardless of who's searching —
// under-16 students are only ever reachable via their own invite code.
export async function searchUsersByUsername(userId, query) {
  const q = (query || "").trim();
  if (q.length < 2) return [];
  const { data } = await db().from("profiles")
    .select("id, username, avatar_url, age_band")
    .ilike("username", `%${q}%`)
    .eq("age_band", "16plus")
    .neq("id", userId)
    .limit(10);
  return data || [];
}

const LINK_RE = /(https?:\/\/|www\.)\S+/i;

export async function sendMessage(userId, friendId, body) {
  if (!isUuid(friendId)) return { error: "Invalid recipient." };
  const text = (body || "").trim().slice(0, 500);
  if (!text) return { error: "Message is empty." };
  if (LINK_RE.test(text)) return { error: "Links aren't allowed in messages." };

  const { data: friendship } = await db().from("friendships").select("user_id").eq("user_id", userId).eq("friend_id", friendId).maybeSingle();
  if (!friendship) return { error: "You can only message friends you've added." };
  if (await isBlockedEitherWay(userId, friendId)) return { error: "You can't message this person." };

  const { data, error } = await db().from("messages").insert({ sender_id: userId, recipient_id: friendId, body: text }).select().single();
  if (error) return { error: "Couldn't send that message. Try again." };
  return { message: data };
}

export async function listMessages(userId, friendId) {
  if (!isUuid(friendId)) return [];
  const { data } = await db().from("messages")
    .select("id, sender_id, recipient_id, body, created_at")
    .or(`and(sender_id.eq.${userId},recipient_id.eq.${friendId}),and(sender_id.eq.${friendId},recipient_id.eq.${userId})`)
    .order("created_at", { ascending: true })
    .limit(200);
  return data || [];
}
