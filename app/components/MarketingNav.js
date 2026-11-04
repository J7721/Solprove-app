"use client";
import { useState } from "react";
import { LAUNCHED, WAITLIST_HREF } from "../../lib/launch";

const ALL_NAV_ITEMS = [
  { key: "home", label: "Home", href: "/" },
  { key: "product", label: "Explore the app", href: "/product.html" },
  { key: "app", label: "Program", href: "/app", launchedOnly: true },
  { key: "pricing", label: "Pricing", href: "/pricing" },
  { key: "about", label: "About", href: "/about" },
  { key: "contact", label: "Contact", href: "/contact" },
];

export default function MarketingNav({ current }) {
  const [open, setOpen] = useState(false);
  const navItems = ALL_NAV_ITEMS.filter(item => LAUNCHED || !item.launchedOnly);
  const cta = LAUNCHED
    ? { label: "Start free trial", href: "/app" }
    : { label: "Join the Waitlist", href: WAITLIST_HREF };

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(250,249,246,.92)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(23,59,76,.08)" }}>
      <style>{`
        .nav-desktop{display:flex;align-items:center;gap:4px}
        .nav-cta{display:inline-block}
        .nav-burger{display:none}
        .nav-mobile-panel{display:none}
        @media(max-width:900px){
          .nav-desktop{display:none}
          .nav-cta{display:none}
          .nav-burger{display:flex}
          .nav-mobile-panel.open{display:flex}
        }
      `}</style>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 20px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", minWidth: 0 }}>
          <img src="/solprove-logo.png" alt="Solprove" style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 18, color: "#12181b", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>Solprove</span>
        </a>

        <div className="nav-desktop">
          {navItems.map(item => (
            <a key={item.key} href={item.href} style={{
              padding: "8px 14px", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap",
              color: current === item.key ? "#ffffff" : "#173b4c",
              background: current === item.key ? "#1f9d7c" : "transparent",
            }}>
              {item.label}
            </a>
          ))}
        </div>

        <a href={cta.href} className="nav-cta" style={{ background: "#e2793c", color: "#ffffff", fontSize: 14, fontWeight: 700, padding: "11px 20px", borderRadius: 9, boxShadow: "0 4px 14px rgba(226,121,60,.28)", textDecoration: "none", whiteSpace: "nowrap" }}>
          {cta.label}
        </a>

        <button
          className="nav-burger"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          style={{ width: 40, height: 40, borderRadius: 9, border: "1px solid rgba(23,59,76,.15)", background: "#ffffff", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
        >
          <span style={{ fontSize: 18, color: "#173b4c" }}>{open ? "×" : "☰"}</span>
        </button>
      </div>

      <div className={`nav-mobile-panel${open ? " open" : ""}`} style={{ flexDirection: "column", padding: "8px 20px 20px", gap: 6, borderTop: "1px solid rgba(23,59,76,.08)" }}>
        {navItems.map(item => (
          <a
            key={item.key}
            href={item.href}
            onClick={() => setOpen(false)}
            style={{
              padding: "12px 14px", borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: "none",
              color: current === item.key ? "#ffffff" : "#173b4c",
              background: current === item.key ? "#1f9d7c" : "transparent",
            }}
          >
            {item.label}
          </a>
        ))}
        <a
          href={cta.href}
          onClick={() => setOpen(false)}
          style={{ marginTop: 6, textAlign: "center", background: "#e2793c", color: "#ffffff", fontSize: 15, fontWeight: 700, padding: "13px 20px", borderRadius: 9, textDecoration: "none" }}
        >
          {cta.label}
        </a>
      </div>
    </div>
  );
}
