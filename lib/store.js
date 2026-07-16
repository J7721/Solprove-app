// Storage adapter.
// - No Supabase keys in .env.local  → JSON file (data/db.json), exactly as Milestone 2
// - Supabase keys present           → Supabase tables (multi-user ready)
// Same function names either way, so the rest of the app never cares which is active.
import fs from "fs";
import path from "path";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const useSupabase = Boolean(SUPA_URL && SUPA_SERVICE);

// ---------- JSON-file backend (local dev / single user) ----------
const DB_PATH = path.join(process.cwd(), "data", "db.json");
function loadFile() {
  try { return JSON.parse(fs.readFileSync(DB_PATH, "utf8")); } catch { return { attempts: [] }; }
}
function saveFile(db) { fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2)); }

// ---------- Supabase backend ----------
let supa = null;
async function getSupa() {
  if (!supa) {
    const { createClient } = await import("@supabase/supabase-js");
    supa = createClient(SUPA_URL, SUPA_SERVICE);
  }
  return supa;
}

// ---------- Public API ----------
export async function recordAttempt({ userId, questionId, specRef, score, outOf, question }) {
  if (useSupabase) {
    const db = await getSupa();
    await db.from("attempts").insert({
      user_id: userId || null,
      question_id: questionId || null,
      spec_ref: specRef || "unknown",
      score, out_of: outOf,
      question: (question || "").slice(0, 200),
    });
    return;
  }
  const db = loadFile();
  db.attempts.push({
    ts: new Date().toISOString(),
    questionId: questionId || null,
    specRef: specRef || "unknown",
    score, outOf,
    question: (question || "").slice(0, 200),
  });
  saveFile(db);
}

export async function allAttempts(userId) {
  if (useSupabase) {
    const db = await getSupa();
    let q = db.from("attempts").select("*").order("ts", { ascending: false }).limit(500);
    if (userId) q = q.eq("user_id", userId);
    const { data } = await q;
    return (data || []).map(a => ({ ...a, specRef: a.spec_ref, outOf: a.out_of }));
  }
  return loadFile().attempts.slice().reverse();
}

export async function topicStats(userId) {
  const attempts = await allAttempts(userId);
  const byRef = {};
  for (const a of attempts) {
    if (!a.specRef || a.specRef === "unknown") continue;
    byRef[a.specRef] ||= { attempts: 0, earned: 0, available: 0 };
    byRef[a.specRef].attempts += 1;
    byRef[a.specRef].earned += a.score;
    byRef[a.specRef].available += a.outOf;
  }
  return Object.entries(byRef).map(([ref, s]) => ({
    ref,
    attempts: s.attempts,
    accuracy: s.available ? s.earned / s.available : 0,
  }));
}

export async function weakTopics(userId) {
  return (await topicStats(userId))
    .filter(t => t.attempts >= 2 && t.accuracy < 0.7)
    .sort((a, b) => a.accuracy - b.accuracy);
}
