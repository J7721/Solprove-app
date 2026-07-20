"use client";
import { useState } from "react";
import { CONTACT_FORMSPREE_ENDPOINT } from "../../lib/launch";

export default function ContactForm() {
  const [fields, setFields] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  function update(key) {
    return e => setFields(f => ({ ...f, [key]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(CONTACT_FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div style={{ background: "#f1f0ea", borderRadius: 18, padding: 40, textAlign: "center" }}>
        <p style={{ fontSize: 16, fontWeight: 600, margin: 0, color: "#12181b" }}>
          Message sent 🎉 — I&apos;ll get back to you at {fields.email || "your email"} soon.
        </p>
      </div>
    );
  }

  return (
    <form
      action={CONTACT_FORMSPREE_ENDPOINT}
      method="POST"
      onSubmit={submit}
      style={{ background: "#f1f0ea", borderRadius: 18, padding: 40, display: "flex", flexDirection: "column", gap: 18 }}
    >
      <div className="contact-field">
        <label style={{ fontSize: 13, fontWeight: 600, color: "#173b4c" }}>Name</label>
        <input type="text" name="name" placeholder="Your name" required value={fields.name} onChange={update("name")} />
      </div>
      <div className="contact-field">
        <label style={{ fontSize: 13, fontWeight: 600, color: "#173b4c" }}>Email</label>
        <input type="email" name="email" placeholder="you@email.com" required value={fields.email} onChange={update("email")} />
      </div>
      <div className="contact-field">
        <label style={{ fontSize: 13, fontWeight: 600, color: "#173b4c" }}>Message</label>
        <textarea name="message" placeholder="How can we help?" rows={4} required style={{ resize: "vertical" }} value={fields.message} onChange={update("message")} />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        style={{ background: "#1f9d7c", color: "#ffffff", fontSize: 15, fontWeight: 700, padding: 14, borderRadius: 9, border: "none", cursor: status === "sending" ? "default" : "pointer", marginTop: 6, opacity: status === "sending" ? 0.7 : 1 }}
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      {status === "error" ? (
        <p style={{ fontSize: 12.5, color: "#c9622e", margin: 0 }}>
          Something went wrong — try again, or email <a href="mailto:hello@solprove.co.uk" style={{ color: "#c9622e", textDecoration: "underline" }}>hello@solprove.co.uk</a> directly.
        </p>
      ) : (
        <p style={{ fontSize: 12.5, color: "#5b6b6f", margin: 0 }}>Sent straight to me — I read everything.</p>
      )}
    </form>
  );
}
