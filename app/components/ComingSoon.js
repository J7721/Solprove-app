import { WAITLIST_HREF } from "../../lib/launch";

export default function ComingSoon({ title = "Not open just yet", body = "Solprove is launching soon. Join the waitlist and we'll email you the moment it's live." }) {
  return (
    <div style={{ padding: "80px 0", textAlign: "center" }}>
      <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 32, fontWeight: 700, color: "#12181b", margin: "0 0 14px" }}>{title}</h1>
      <p style={{ fontSize: 16, color: "#5b6b6f", maxWidth: 440, margin: "0 auto 28px" }}>{body}</p>
      <a href={WAITLIST_HREF} style={{ background: "#1f9d7c", color: "#fff", fontWeight: 700, fontSize: 15, padding: "14px 26px", borderRadius: 10, textDecoration: "none", display: "inline-block" }}>
        Coming Soon - Join The Waitlist
      </a>
      <div style={{ marginTop: 18 }}>
        <a href="/" style={{ fontSize: 13, color: "#5b6b6f" }}>← Back to home</a>
      </div>
    </div>
  );
}
