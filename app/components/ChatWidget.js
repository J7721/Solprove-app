"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const GREETING = "Hi! I'm the Solprove assistant. Ask me about pricing, how marking works, or when we launch.";

export default function ChatWidget() {
  const pathname = usePathname();
  const context = pathname && (pathname.startsWith("/app") || pathname.startsWith("/parent")) ? "workspace" : "marketing";

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open, busy]);

  async function send(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, context }),
      });
      const data = await res.json();
      setMessages(m => [...m, { role: "assistant", content: data.reply || data.error || "Something went wrong — try again." }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Something went wrong — email hello@solprove.co.uk and we'll get back to you." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999, fontFamily: "'Inter', sans-serif" }}>
      {open && (
        <div
          style={{
            width: 340,
            maxWidth: "calc(100vw - 40px)",
            height: 460,
            maxHeight: "calc(100vh - 110px)",
            background: "#ffffff",
            borderRadius: 16,
            boxShadow: "0 20px 50px -12px rgba(0,0,0,.35)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            marginBottom: 12,
            border: "1px solid rgba(23,59,76,.08)",
          }}
        >
          <div style={{ background: "#173b4c", color: "#fff", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 14.5 }}>Solprove Assistant</div>
              <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.6)", display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3ddc97", display: "inline-block" }} />
                AI · available 24/7
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              style={{ background: "transparent", border: "none", color: "rgba(255,255,255,.75)", fontSize: 20, cursor: "pointer", lineHeight: 1, padding: 4 }}
            >
              ×
            </button>
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "14px 14px 6px", display: "flex", flexDirection: "column", gap: 10, background: "#faf9f6" }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "84%",
                  background: m.role === "user" ? "#1f9d7c" : "#f1f0ea",
                  color: m.role === "user" ? "#fff" : "#12181b",
                  borderRadius: 12,
                  padding: "9px 12px",
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.content}
              </div>
            ))}
            {busy && (
              <div style={{ alignSelf: "flex-start", background: "#f1f0ea", color: "#5b6b6f", borderRadius: 12, padding: "9px 12px", fontSize: 13.5 }}>
                Typing…
              </div>
            )}
          </div>

          <form onSubmit={send} style={{ display: "flex", gap: 8, padding: 10, borderTop: "1px solid rgba(23,59,76,.08)", background: "#fff" }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a question…"
              disabled={busy}
              style={{ flex: 1, padding: "10px 12px", borderRadius: 9, border: "1px solid rgba(23,59,76,.15)", fontSize: 13.5, fontFamily: "inherit" }}
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              style={{
                background: "#1f9d7c",
                color: "#fff",
                border: "none",
                borderRadius: 9,
                padding: "0 16px",
                fontWeight: 700,
                fontSize: 13.5,
                cursor: busy || !input.trim() ? "default" : "pointer",
                opacity: busy || !input.trim() ? 0.6 : 1,
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#1f9d7c",
          color: "#fff",
          border: "none",
          boxShadow: "0 10px 24px rgba(31,157,124,.4)",
          cursor: "pointer",
          fontSize: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "auto",
        }}
      >
        {open ? "×" : "💬"}
      </button>
    </div>
  );
}
