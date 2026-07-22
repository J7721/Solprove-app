import { LAUNCHED } from "../../lib/launch";

const ALL_FOOTER_ITEMS = [
  { key: "home", label: "Home", href: "/" },
  { key: "app", label: "Program", href: "/app", launchedOnly: true },
  { key: "pricing", label: "Pricing", href: "/pricing" },
  { key: "about", label: "About", href: "/about" },
  { key: "contact", label: "Contact", href: "/contact" },
  { key: "privacy", label: "Privacy", href: "/privacy" },
  { key: "terms", label: "Terms", href: "/terms" },
];

export default function MarketingFooter() {
  const footerItems = ALL_FOOTER_ITEMS.filter(item => LAUNCHED || !item.launchedOnly);
  return (
    <footer style={{ background: "#12181b", padding: "48px 0 28px" }}>
      <style>{`
        .footer-row{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:28px}
        .footer-links{display:flex;gap:24px;flex-wrap:wrap}
        @media(max-width:600px){
          .footer-row{flex-direction:column;align-items:flex-start;gap:20px}
          .footer-links{gap:14px 20px}
        }
      `}</style>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 20px" }}>
        <div className="footer-row" style={{ paddingBottom: 32, borderBottom: "1px solid rgba(255,255,255,.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/solprove-logo.png" alt="Solprove" style={{ width: 30, height: 30, borderRadius: 7, objectFit: "cover" }} />
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 17, color: "#ffffff" }}>Solprove</span>
          </div>
          <div className="footer-links">
            {footerItems.map(item => (
              <a key={item.key} href={item.href} style={{ color: "rgba(255,255,255,.65)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div style={{ paddingTop: 22, fontSize: 13, color: "rgba(255,255,255,.4)" }}>
          © 2026 Solprove. GCSE Maths, with more subjects on the way.
        </div>
      </div>
    </footer>
  );
}
