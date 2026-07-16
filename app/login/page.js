"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "../../lib/supabaseBrowser";

const card = { background: "#fff", border: "1px solid #e6e9f2", borderRadius: 14, padding: 24, maxWidth: 440, margin: "40px auto" };
const btn = { background: "#18b57a", color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontWeight: 700, fontSize: 15, cursor: "pointer", width: "100%" };
const input = { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #cfd6e6", fontSize: 15, boxSizing: "border-box", marginBottom: 10 };
const tab = active => ({ flex: 1, padding: "10px 0", border: "none", background: "none", fontWeight: 700, fontSize: 14.5, cursor: "pointer", color: active ? "#0e9c67" : "#5a6482", borderBottom: active ? "3px solid #18b57a" : "3px solid #e6e9f2" });

export default function Login() {
  const [mode, setMode] = useState("signin"); // signin | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState(null); // {type:'ok'|'err', text}
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabaseBrowser().auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabaseBrowser().auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setMsg(null); setBusy(true);
    const supa = supabaseBrowser();

    if (mode === "signup") {
      if (password.length < 8) {
        setMsg({ type: "err", text: "Password needs at least 8 characters." });
        setBusy(false); return;
      }
      const { data, error } = await supa.auth.signUp({ email, password });
      if (error) setMsg({ type: "err", text: error.message });
      else if (data.session) setMsg({ type: "ok", text: "Account created — you're signed in!" });
      else setMsg({ type: "ok", text: "Account created! Check your email to confirm your address, then sign in." });
    } else {
      const { error } = await supa.auth.signInWithPassword({ email, password });
      if (error) setMsg({ type: "err", text: error.message === "Invalid login credentials" ? "Wrong email or password." : error.message });
    }
    setBusy(false);
  }

  async function signOut() { await supabaseBrowser().auth.signOut(); }

  async function forgotPassword() {
    if (!email) return setMsg({ type: "err", text: "Type your email above first, then click Forgot password." });
    const { error } = await supabaseBrowser().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset`,
    });
    if (error) setMsg({ type: "err", text: error.message });
    else setMsg({ type: "ok", text: `Reset link sent to ${email} — check your inbox.` });
  }

  if (user) {
    return (
      <div style={card}>
        <h2 style={{ marginTop: 0 }}>You're signed in ✓</h2>
        <p style={{ color: "#5a6482", fontSize: 14.5 }}>{user.email}</p>
        <p style={{ fontSize: 14.5 }}>Everything your child practises is saved to your family account. The Parent view shows only your data.</p>
        <a href="/" style={{ ...btn, display: "block", textAlign: "center", textDecoration: "none", marginBottom: 8 }}>Go to the tutor →</a>
        <button onClick={signOut} style={{ ...btn, background: "#eef1f8", color: "#1c2340" }}>Sign out</button>
      </div>
    );
  }

  return (
    <div style={card}>
      <div style={{ display: "flex", marginBottom: 18 }}>
        <button style={tab(mode === "signin")} onClick={() => { setMode("signin"); setMsg(null); }}>Sign in</button>
        <button style={tab(mode === "signup")} onClick={() => { setMode("signup"); setMsg(null); }}>Create account</button>
      </div>
      <form onSubmit={submit}>
        {mode === "signup" && (
          <p style={{ color: "#5a6482", fontSize: 14, marginTop: 0 }}>One account per family — a parent's email, used for progress reports and billing later.</p>
        )}
        <input style={input} type="email" required placeholder="parent@email.com" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={input} type="password" required placeholder={mode === "signup" ? "Choose a password (8+ characters)" : "Password"} value={password} onChange={e => setPassword(e.target.value)} />
        <button style={btn} type="submit" disabled={busy}>
          {busy ? "One moment…" : mode === "signup" ? "Create account" : "Sign in"}
        </button>
        {mode === "signin" && (
          <p style={{ textAlign: "center", margin: "12px 0 0" }}>
            <button type="button" onClick={forgotPassword} style={{ background: "none", border: "none", color: "#5b6ee1", fontSize: 13.5, cursor: "pointer", textDecoration: "underline" }}>
              Forgot password?
            </button>
          </p>
        )}
        {msg && (
          <p style={{ background: msg.type === "ok" ? "#eafaf2" : "#fdecea", color: msg.type === "ok" ? "#0e9c67" : "#c0392b", padding: 12, borderRadius: 10, fontSize: 14 }}>
            {msg.text}
          </p>
        )}
      </form>
    </div>
  );
}
