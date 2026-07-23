"use client";
import { useState } from "react";
import { FORMSPREE_ENDPOINT } from "../../lib/launch";

const INTERESTS = [
  "GCSE Maths (available now)",
  "A-Level Maths",
  "GCSE Science",
  "A-Level Science",
  "Another subject",
];

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState(INTERESTS[0]);
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  async function submit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email, interest }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
        You&apos;re on the list 🎉 — we&apos;ll email you the moment we launch.
      </p>
    );
  }

  return (
    <div>
      <style>{`
        @media(max-width:420px){
          .waitlist-form{flex-direction:column !important}
          .waitlist-form input,.waitlist-form select{min-width:0 !important;width:100%}
          .waitlist-form button{width:100%}
        }
      `}</style>
      <form
        className="waitlist-form"
        action={FORMSPREE_ENDPOINT}
        method="POST"
        onSubmit={submit}
        style={{ display: "flex", gap: 10, maxWidth: 560, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}
      >
        <input
          type="email"
          name="email"
          required
          placeholder="you@email.com"
          aria-label="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ flex: 1, minWidth: 220, padding: "15px 18px", borderRadius: 12, border: "none", fontSize: 15.5, fontFamily: "inherit" }}
        />
        <select
          name="interest"
          aria-label="What are you most interested in?"
          value={interest}
          onChange={e => setInterest(e.target.value)}
          style={{ minWidth: 190, padding: "15px 14px", borderRadius: 12, border: "none", fontSize: 14.5, fontFamily: "inherit", color: "#12181b", background: "#fff" }}
        >
          {INTERESTS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={status === "sending"}
          style={{ background: "#12181b", color: "#fff", border: "none", fontWeight: 700, padding: "15px 26px", borderRadius: 12, fontSize: 15, cursor: status === "sending" ? "default" : "pointer", opacity: status === "sending" ? 0.7 : 1 }}
        >
          {status === "sending" ? "Joining…" : "Join the waitlist"}
        </button>
      </form>
      {status === "error" && (
        <p style={{ fontSize: 13, marginTop: 12, color: "#ffd9c2" }}>
          Something went wrong — try again, or email <a href="mailto:hello@solprove.co.uk" style={{ color: "#ffd9c2", textDecoration: "underline" }}>hello@solprove.co.uk</a> directly.
        </p>
      )}
    </div>
  );
}
