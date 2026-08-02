"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "../../lib/supabaseBrowser";

const card = { background: "#fff", border: "1px solid #e6e9f2", borderRadius: 14, padding: 24, maxWidth: 480, margin: "24px auto" };
const btn = (bg = "#18b57a") => ({ background: bg, color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontWeight: 700, fontSize: 15, cursor: "pointer", width: "100%" });
const input = { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #cfd6e6", fontSize: 15, boxSizing: "border-box", marginBottom: 10 };
const label = { fontWeight: 700, fontSize: 14, display: "block", marginBottom: 6 };
const divider = { border: "none", borderTop: "1px solid #eef1f8", margin: "22px 0" };

// Resize any image to a small square avatar (base64), so no file storage is needed
function fileToAvatar(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const size = 96;
      const canvas = document.createElement("canvas");
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext("2d");
      const s = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = reject;
    img.src = url;
  });
}

async function authHeaders() {
  const { data } = await supabaseBrowser().auth.getSession();
  const t = data.session?.access_token;
  return { "Content-Type": "application/json", ...(t ? { Authorization: `Bearer ${t}` } : {}) };
}

export default function Account() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [ageBand, setAgeBand] = useState("under16");
  const [savingAgeBand, setSavingAgeBand] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [emailStep, setEmailStep] = useState("enter"); // enter | code
  const [code, setCode] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [msg, setMsg] = useState(null);
  const note = (type, text) => setMsg({ type, text });

  useEffect(() => {
    (async () => {
      const { data } = await supabaseBrowser().auth.getUser();
      setUser(data.user);
      if (data.user) {
        const { data: prof } = await supabaseBrowser().from("profiles").select("username, avatar_url, age_band").eq("id", data.user.id).maybeSingle();
        if (prof) { setUsername(prof.username || ""); setAvatar(prof.avatar_url || null); setAgeBand(prof.age_band || "under16"); }
      }
    })();
  }, []);

  async function saveProfile(e) {
    e.preventDefault();
    setSavingProfile(true);
    const { error } = await supabaseBrowser().from("profiles").upsert({
      id: user.id, username: username || null, avatar_url: avatar || null, parent_email: user.email,
    });
    setSavingProfile(false);
    note(error ? "err" : "ok", error ? error.message : "Profile saved.");
  }

  async function onAvatarFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    try { setAvatar(await fileToAvatar(f)); } catch { note("err", "Couldn't read that image — try a JPG or PNG."); }
  }

  async function requestEmailChange(e) {
    e.preventDefault();
    const { error } = await supabaseBrowser().auth.updateUser({ email: newEmail });
    if (error) return note("err", error.message);
    setEmailStep("code");
    note("ok", `Confirmation email sent to ${newEmail} — open that inbox and click the link. Then come back here.`);
  }

  async function checkEmailChanged() {
    const { data } = await supabaseBrowser().auth.getUser();
    setUser(data.user);
    if (data.user?.email === newEmail) {
      note("ok", "Email updated ✓ — reports and billing now go to your new address.");
      setEmailStep("enter"); setNewEmail("");
    } else {
      note("err", "Not confirmed yet — click the link in the email first, then try again.");
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    if (newPassword.length < 8) return note("err", "New password needs at least 8 characters.");
    if (newPassword !== confirmPassword) return note("err", "New passwords don't match.");
    // Verify the old password by re-authenticating first
    const { error: authErr } = await supabaseBrowser().auth.signInWithPassword({ email: user.email, password: oldPassword });
    if (authErr) return note("err", "Your current password is incorrect.");
    const { error } = await supabaseBrowser().auth.updateUser({ password: newPassword });
    if (error) return note("err", error.message);
    note("ok", "Password updated.");
    setOldPassword(""); setNewPassword(""); setConfirmPassword("");
  }

  async function saveAgeBand(band) {
    setSavingAgeBand(true);
    const prev = ageBand;
    setAgeBand(band);
    const res = await fetch("/api/social/settings", { method: "POST", headers: await authHeaders(), body: JSON.stringify({ ageBand: band }) });
    setSavingAgeBand(false);
    if (!res.ok) { setAgeBand(prev); note("err", "Couldn't update this — try again."); return; }
    note("ok", band === "16plus" ? "Set to 16+ — friend search and open discovery are now available." : "Set to under-16 — friends can only be added by invite code, matching current online safety guidance for younger students.");
  }

  async function signOut() {
    await supabaseBrowser().auth.signOut();
    window.location.href = "/app";
  }

  if (!user) {
    return (
      <div style={card}>
        <h2 style={{ marginTop: 0 }}>Account</h2>
        <p style={{ color: "#5a6482", fontSize: 14.5 }}>You're not signed in.</p>
        <a href="/login" style={{ ...btn(), display: "block", textAlign: "center", textDecoration: "none" }}>Go to sign in →</a>
      </div>
    );
  }

  return (
    <div style={card}>
      <h2 style={{ marginTop: 0 }}>Account</h2>
      {msg && (
        <p style={{ background: msg.type === "ok" ? "#eafaf2" : "#fdecea", color: msg.type === "ok" ? "#0e9c67" : "#c0392b", padding: 12, borderRadius: 10, fontSize: 14 }}>
          {msg.text}
        </p>
      )}

      {/* PROFILE */}
      <form onSubmit={saveProfile}>
        <span style={label}>Profile</span>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          {avatar ? (
            <img src={avatar} alt="" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "2px solid #18b57a" }} />
          ) : (
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#eef1f8", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 24, color: "#5a6482" }}>
              {(username || user.email)[0].toUpperCase()}
            </div>
          )}
          <label style={{ fontSize: 13.5, color: "#5b6ee1", cursor: "pointer", textDecoration: "underline" }}>
            Change picture
            <input type="file" accept="image/*" onChange={onAvatarFile} style={{ display: "none" }} />
          </label>
        </div>
        <input style={input} placeholder="Username (e.g. The Smith family)" value={username} onChange={e => setUsername(e.target.value)} maxLength={30} />
        <button style={btn("#5b6ee1")} type="submit" disabled={savingProfile}>{savingProfile ? "Saving…" : "Save profile"}</button>
      </form>

      <hr style={divider} />

      {/* AGE BAND — controls friends/messaging safety rules, parent-managed */}
      <span style={label}>Friends & messaging</span>
      <p style={{ color: "#5a6482", fontSize: 13, margin: "0 0 12px" }}>
        This controls how your child's account can be found and messaged by other students. Defaults to the safer, more restricted setting.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 4 }}>
        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: 12, border: `1px solid ${ageBand === "under16" ? "#18b57a" : "#e6e9f2"}`, borderRadius: 10, cursor: "pointer" }}>
          <input type="radio" checked={ageBand === "under16"} onChange={() => saveAgeBand("under16")} disabled={savingAgeBand} style={{ marginTop: 3 }} />
          <span>
            <b style={{ fontSize: 14 }}>Under 16 (recommended default)</b>
            <p style={{ fontSize: 12.5, color: "#5a6482", margin: "2px 0 0" }}>Friends can only be added using a private invite code shared directly with someone they know. No public search, no messages from strangers.</p>
          </span>
        </label>
        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: 12, border: `1px solid ${ageBand === "16plus" ? "#18b57a" : "#e6e9f2"}`, borderRadius: 10, cursor: "pointer" }}>
          <input type="radio" checked={ageBand === "16plus"} onChange={() => saveAgeBand("16plus")} disabled={savingAgeBand} style={{ marginTop: 3 }} />
          <span>
            <b style={{ fontSize: 14 }}>16 or older</b>
            <p style={{ fontSize: 12.5, color: "#5a6482", margin: "2px 0 0" }}>Can also be found and added via username search. Messaging still only works between added friends either way.</p>
          </span>
        </label>
      </div>

      <hr style={divider} />

      {/* EMAIL */}
      <span style={label}>Change email</span>
      <p style={{ color: "#5a6482", fontSize: 13, margin: "0 0 8px" }}>Currently: <b>{user.email}</b></p>
      {emailStep === "enter" ? (
        <form onSubmit={requestEmailChange}>
          <input style={input} type="email" required placeholder="new@email.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
          <button style={btn("#5b6ee1")} type="submit">Send verification code</button>
        </form>
      ) : (
        <div>
          <p style={{ fontSize: 14, color: "#5a6482" }}>📬 Waiting for you to click the confirmation link sent to <b>{newEmail}</b>…</p>
          <button style={btn()} onClick={checkEmailChanged}>I've clicked the link — check now</button>
          <button type="button" onClick={() => setEmailStep("enter")} style={{ background: "none", border: "none", color: "#5a6482", fontSize: 13, cursor: "pointer", marginTop: 8, width: "100%" }}>Cancel</button>
        </div>
      )}

      <hr style={divider} />

      {/* PASSWORD */}
      <form onSubmit={changePassword}>
        <span style={label}>Change password</span>
        <input style={input} type="password" required placeholder="Current password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
        <input style={input} type="password" required placeholder="New password (8+ characters)" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        <input style={input} type="password" required placeholder="Repeat new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        <button style={btn("#5b6ee1")} type="submit">Update password</button>
      </form>

      <hr style={divider} />

      <button onClick={signOut} style={btn("#eef1f8")}>
        <span style={{ color: "#1c2340" }}>Sign out</span>
      </button>
    </div>
  );
}
