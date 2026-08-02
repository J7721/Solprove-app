"use client";
import { useEffect, useState } from "react";

const card = { background: "#fff", border: "1px solid #e6e9f2", borderRadius: 14, padding: 24, maxWidth: 640, margin: "40px auto" };
const btn = (bg = "#18b57a") => ({ background: bg, color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontWeight: 700, fontSize: 15, cursor: "pointer" });
const input = { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #cfd6e6", fontSize: 15, boxSizing: "border-box", marginBottom: 10, fontFamily: "inherit" };
const label = { fontWeight: 700, fontSize: 14, display: "block", marginBottom: 6 };

export default function WaitlistAdmin() {
  const [steps, setSteps] = useState([]);
  const [stepNum, setStepNum] = useState(1);
  const [secret, setSecret] = useState("");
  const [emails, setEmails] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch("/api/waitlist-sequence").then((r) => r.json()).then((d) => setSteps(d.steps || []));
  }, []);

  const current = steps.find((s) => s.step === stepNum);
  const emailCount = emails.split(/[\n,]/).map((e) => e.trim()).filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)).length;

  async function send() {
    if (!confirm(`Send "${current?.subject}" to ${emailCount} email address${emailCount === 1 ? "" : "es"}? This can't be undone.`)) return;
    setSending(true); setResult(null);
    const res = await fetch("/api/waitlist-sequence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, step: stepNum, emails }),
    });
    const data = await res.json();
    setSending(false);
    setResult(res.ok ? { type: "ok", data } : { type: "err", text: data.error });
  }

  return (
    <div style={card}>
      <h2 style={{ marginTop: 0 }}>Waitlist email sequence</h2>
      <p style={{ color: "#5a6482", fontSize: 13.5 }}>
        Export signups from your Formspree dashboard, paste the email addresses below, pick a step, and send. Steps 1–3 are for nurturing the waitlist; step 4 is the launch announcement — send that one once, right after you flip <code>LAUNCHED</code> live.
      </p>

      <span style={label}>Sequence step</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {steps.map((s) => (
          <label key={s.step} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: 10, border: `1px solid ${stepNum === s.step ? "#18b57a" : "#e6e9f2"}`, borderRadius: 10, cursor: "pointer" }}>
            <input type="radio" checked={stepNum === s.step} onChange={() => setStepNum(s.step)} style={{ marginTop: 3 }} />
            <span>
              <b style={{ fontSize: 13.5 }}>{s.label}</b>
              <div style={{ fontSize: 12.5, color: "#5a6482" }}>Subject: {s.subject}</div>
            </span>
          </label>
        ))}
      </div>

      {current && (
        <>
          <button type="button" onClick={() => setShowPreview((v) => !v)} style={{ background: "none", border: "none", color: "#5b6ee1", fontSize: 13, cursor: "pointer", textDecoration: "underline", padding: 0, marginBottom: 12 }}>
            {showPreview ? "Hide preview" : "Preview this email"}
          </button>
          {showPreview && (
            <iframe title="preview" srcDoc={current.html} style={{ width: "100%", height: 420, border: "1px solid #e6e9f2", borderRadius: 10, marginBottom: 16 }} />
          )}
        </>
      )}

      <span style={label}>Recipients</span>
      <textarea style={{ ...input, minHeight: 100, resize: "vertical" }} placeholder={"One email per line (or comma-separated)\nparent1@email.com\nparent2@email.com"} value={emails} onChange={(e) => setEmails(e.target.value)} />
      <p style={{ fontSize: 12.5, color: "#5a6482", marginTop: -4 }}>{emailCount} valid address{emailCount === 1 ? "" : "es"} detected.</p>

      <span style={label}>Admin password</span>
      <input style={input} type="password" placeholder="ADMIN_SECRET" value={secret} onChange={(e) => setSecret(e.target.value)} />

      <button style={btn()} onClick={send} disabled={sending || !current || !emailCount || !secret}>
        {sending ? "Sending…" : `Send to ${emailCount || 0} people`}
      </button>

      {result && (
        <p style={{ marginTop: 14, padding: 12, borderRadius: 10, fontSize: 13.5, background: result.type === "ok" ? "#eafaf2" : "#fdecea", color: result.type === "ok" ? "#0e9c67" : "#c0392b" }}>
          {result.type === "ok"
            ? `Sent ${result.data.sent}/${result.data.total}.${result.data.failed?.length ? ` Failed: ${result.data.failed.map((f) => f.to).join(", ")}` : ""}`
            : result.text}
        </p>
      )}
    </div>
  );
}
