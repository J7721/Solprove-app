import { LAUNCHED, WAITLIST_HREF } from "../../lib/launch";

const ALL_NAV_ITEMS = [
  { key: "home", label: "Home", href: "/" },
  { key: "app", label: "Program", href: "/app", launchedOnly: true },
  { key: "pricing", label: "Pricing", href: "/pricing" },
  { key: "about", label: "About", href: "/about" },
  { key: "contact", label: "Contact", href: "/contact" },
];

export default function MarketingNav({ current }) {
  const navItems = ALL_NAV_ITEMS.filter(item => LAUNCHED || !item.launchedOnly);
  const cta = LAUNCHED
    ? { label: "Start free trial", href: "/app" }
    : { label: "Join the Waitlist", href: WAITLIST_HREF };

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(250,249,246,.92)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(23,59,76,.08)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/solprove-logo.png" alt="Solprove" style={{ width: 34, height: 34, borderRadius: 8, objectFit: "cover" }} />
          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 19, color: "#12181b", letterSpacing: "-0.01em" }}>Solprove</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
          {navItems.map(item => (
            <a key={item.key} href={item.href} style={{
              padding: "8px 14px", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none",
              color: current === item.key ? "#ffffff" : "#173b4c",
              background: current === item.key ? "#1f9d7c" : "transparent",
            }}>
              {item.label}
            </a>
          ))}
        </div>
        <a href={cta.href} style={{ background: "#e2793c", color: "#ffffff", fontSize: 14, fontWeight: 700, padding: "11px 20px", borderRadius: 9, boxShadow: "0 4px 14px rgba(226,121,60,.28)", textDecoration: "none" }}>
          {cta.label}
        </a>
      </div>
    </div>
  );
}
