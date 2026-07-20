import { LAUNCHED } from "../../lib/launch";

const ALL_FOOTER_ITEMS = [
  { key: "home", label: "Home", href: "/" },
  { key: "app", label: "Program", href: "/app", launchedOnly: true },
  { key: "pricing", label: "Pricing", href: "/pricing" },
  { key: "about", label: "About", href: "/about" },
  { key: "contact", label: "Contact", href: "/contact" },
];

export default function MarketingFooter() {
  const footerItems = ALL_FOOTER_ITEMS.filter(item => LAUNCHED || !item.launchedOnly);
  return (
    <footer style={{ background: "#12181b", padding: "56px 0 32px" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40, paddingBottom: 36, borderBottom: "1px solid rgba(255,255,255,.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/solprove-logo.png" alt="Solprove" style={{ width: 30, height: 30, borderRadius: 7, objectFit: "cover" }} />
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 17, color: "#ffffff" }}>Solprove</span>
          </div>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {footerItems.map(item => (
              <a key={item.key} href={item.href} style={{ color: "rgba(255,255,255,.65)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div style={{ paddingTop: 24, fontSize: 13, color: "rgba(255,255,255,.4)" }}>
          © 2026 Solprove. GCSE Maths, with more subjects on the way.
        </div>
      </div>
    </footer>
  );
}
