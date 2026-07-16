"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "../../lib/supabaseBrowser";

const link = { color: "#c6cde6", textDecoration: "none", fontSize: 14, fontWeight: 600, padding: "6px 12px", borderRadius: 8 };

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
    <>
      <a href="/account" style={{ ...link, background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", gap: 8 }}>
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", border: "1.5px solid #18b57a" }} />
        ) : (
          <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#18b57a", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 13 }}>
            {name[0].toUpperCase()}
          </span>
        )}
        <span style={{ color: "#fff" }}>{name}</span>
      </a>
      <button
        onClick={async () => { await supabaseBrowser().auth.signOut(); window.location.href = "/"; }}
        style={{ ...link, background: "none", border: "1px solid rgba(255,255,255,.25)", cursor: "pointer" }}
      >
        Sign out
      </button>
    </>
  );
}
