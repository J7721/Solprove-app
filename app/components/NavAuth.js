"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "../../lib/supabaseBrowser";

const link = { color: "rgba(255,255,255,.85)", textDecoration: "none", fontSize: 13, fontWeight: 600, padding: "8px 14px", borderRadius: 8, fontFamily: "'Inter', sans-serif" };

export default function NavAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  async function loadProfile(u) {
    if (!u) return setProfile(null);
    const { data } = await supabaseBrowser().from("profiles").select("username, avatar_url").eq("id", u.id).maybeSingle();
    setProfile(data || null);
  }

  useEffect(() => {
    supabaseBrowser().auth.getUser().then(({ data }) => { setUser(data.user); loadProfile(data.user); });
    const { data: sub } = supabaseBrowser().auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
      loadProfile(session?.user || null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!user) {
    return <a href="/login" style={{ ...link, background: "rgba(255,255,255,.08)" }}>Sign in</a>;
  }

  const name = profile?.username || user.email.split("@")[0];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <a href="/account" style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 16, borderLeft: "1px solid rgba(255,255,255,.15)", textDecoration: "none" }}>
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
        ) : (
          <span style={{ width: 32, height: 32, borderRadius: "50%", background: "#1f9d7c", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13, fontFamily: "'Sora', sans-serif" }}>
            {name[0].toUpperCase()}
          </span>
        )}
        <span style={{ fontSize: 14, fontWeight: 600, color: "#ffffff" }}>{name}</span>
      </a>
      <button
        onClick={async () => { await supabaseBrowser().auth.signOut(); window.location.href = "/app"; }}
        style={{ ...link, background: "none", border: "1px solid rgba(255,255,255,.25)", cursor: "pointer" }}
      >
        Sign out
      </button>
    </div>
  );
}
