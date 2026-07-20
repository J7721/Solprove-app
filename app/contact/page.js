import MarketingNav from "../components/MarketingNav";
import MarketingFooter from "../components/MarketingFooter";

export const metadata = { title: "Contact — Solprove" };

export default function Contact() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "linear-gradient(180deg,#eef8f3 0%,#faf9f6 22%,#faf9f6 100%)", color: "#12181b", minHeight: "100vh" }}>
      <style>{`
        *{box-sizing:border-box}
        .contact-grid{display:grid;grid-template-columns:0.9fr 1.1fr;gap:64px}
        .contact-field{display:flex;flex-direction:column;gap:6px}
        .contact-field input,.contact-field textarea{padding:12px 14px;border-radius:9px;border:1px solid rgba(23,59,76,.15);font-size:14px;background:#ffffff;font-family:inherit}
        @media(max-width:800px){.contact-grid{grid-template-columns:1fr}}
      `}</style>
      <MarketingNav current="contact" />

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "88px 32px 96px" }}>
        <div className="contact-grid">
          <div>
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 38, fontWeight: 700, color: "#12181b", margin: "0 0 18px", letterSpacing: "-0.02em" }}>Get in touch</h1>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#5b6b6f", margin: "0 0 32px" }}>Questions about the program, a school partnership, or press? I read everything.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1f9d7c", letterSpacing: ".05em", marginBottom: 4 }}>EMAIL</div>
                <div style={{ fontSize: 15, color: "#12181b", fontWeight: 600 }}><a href="mailto:hello@solprove.co.uk" style={{ color: "#12181b" }}>hello@solprove.co.uk</a></div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1f9d7c", letterSpacing: ".05em", marginBottom: 4 }}>FOR SCHOOLS</div>
                <div style={{ fontSize: 15, color: "#12181b", fontWeight: 600 }}><a href="mailto:schools@solprove.co.uk" style={{ color: "#12181b" }}>schools@solprove.co.uk</a></div>
              </div>
            </div>
          </div>
          <form action="mailto:hello@solprove.co.uk" method="GET" style={{ background: "#f1f0ea", borderRadius: 18, padding: 40, display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="contact-field">
              <label style={{ fontSize: 13, fontWeight: 600, color: "#173b4c" }}>Name</label>
              <input type="text" name="name" placeholder="Your name" />
            </div>
            <div className="contact-field">
              <label style={{ fontSize: 13, fontWeight: 600, color: "#173b4c" }}>Email</label>
              <input type="email" name="email" placeholder="you@email.com" />
            </div>
            <div className="contact-field">
              <label style={{ fontSize: 13, fontWeight: 600, color: "#173b4c" }}>Message</label>
              <textarea name="body" placeholder="How can we help?" rows={4} style={{ resize: "vertical" }} />
            </div>
            <button type="submit" style={{ background: "#1f9d7c", color: "#ffffff", fontSize: 15, fontWeight: 700, padding: 14, borderRadius: 9, border: "none", cursor: "pointer", marginTop: 6 }}>
              Send message
            </button>
            <p style={{ fontSize: 12.5, color: "#5b6b6f", margin: 0 }}>Opens your email app with this message pre-filled — nothing is sent until you hit send there.</p>
          </form>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
