"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "../../lib/supabaseBrowser";

const card = { background: "#fff", border: "1px solid #e6e9f2", borderRadius: 14, padding: 24, maxWidth: 440, margin: "40px auto" };
const btn = { background: "#18b57a", color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontWeight: 700, fontSize: 15, cursor: "pointer", width: "100%" };
const input = { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #cfd6e6", fontSize: 15, boxSizing: "border-box", marginBottom: 10 };

export default function ResetPassword() {
  const [ready, setReady] = useState(false);   // true once the recovery link has signed them in
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Arriving from the reset email signs the user in with a temporary recovery session
    supabaseBrowser().auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
    const { data: sub } = supabaseBrowser().auth.onAuthStateChange((_e, session) => {
      setReady(Boolean(session));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setMsg(null);
    if (password.length < 8) return setMsg("Password needs at least 8 characters.");
    if (password !== confirm) return setMsg("Passwords don't match.");
    const { error } = await supabaseBrowser().auth.updateUser({ password });
    if (error) setMsg(error.message);
    else setDone(true);
  }

  if (done) {
    return (
      <div style={card}>
        <h2 style={{ marginTop: 0 }}>Password updated ✓</h2>
        <p style={{ fontSize: 14.5 }}>You're signed in with your new password.</p>
        <a href="/" style={{ ...btn, display: "block", textAlign: "center", textDecoration: "none" }}>Go to the tutor →</a>
      </div>
    );
  }

  return (
    <div style={card}>
      <h2 style={{ marginTop: 0 }}>Choose a new password</h2>
      {!ready ? (
        <p style={{ color: "#5a6482", fontSize: 14.5 }}>
          This page works via the link in your reset email. If you got here another way, go to{" "}
          <a href="/login">the sign-in page</a> and click "Forgot password?".
        </p>
      ) : (
        <form onSubmit={submit}>
          <input style={input} type="password" required placeholder="New password (8+ characters)" value={password} onChange={e => setPassword(e.target.value)} />
          <input style={input} type="password" required placeholder="Repeat new password" value={confirm} onChange={e => setConfirm(e.target.value)} />
          <button style={btn} type="submit">Set new password</button>
          {msg && <p style={{ color: "#c0392b", fontSize: 13.5 }}>{msg}</p>}
        </form>
      )}
    </div>
  );
}
