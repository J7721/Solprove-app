import MarketingNav from "../components/MarketingNav";
import MarketingFooter from "../components/MarketingFooter";
import { LAUNCHED, WAITLIST_HREF } from "../../lib/launch";

export const metadata = { title: "Pricing — Solprove" };

function buildTiers() {
  return [
    {
      name: "Free", price: "£0", period: "", border: "1px solid rgba(23,59,76,.12)", bg: "#ffffff", textColor: "#12181b", perkColor: "#5b6b6f",
      perks: ["3 questions marked free every day", "Full worked solutions", "Basic progress tracking"],
      cta: LAUNCHED ? "Start free" : "Coming Soon - Join The Waitlist",
      href: LAUNCHED ? "/app" : WAITLIST_HREF,
      ctaStyle: { background: "transparent", color: "#173b4c", border: "1px solid rgba(23,59,76,.2)" },
    },
    {
      name: "Premium", price: "£11.99", period: "/mo", border: "2px solid #1f9d7c", bg: "#ffffff", textColor: "#12181b", perkColor: "#5b6b6f", badge: "MOST POPULAR",
      perks: ["7-day free trial", "Unlimited questions marked", "Personalised practice sets", "Full topic mastery dashboard and reports", "Priority AI response time"],
      cta: LAUNCHED ? "Start free trial" : "Coming Soon - Join The Waitlist",
      href: LAUNCHED ? "/app" : WAITLIST_HREF,
      ctaStyle: { background: "#1f9d7c", color: "#fff", boxShadow: "0 8px 20px rgba(31,157,124,.28)" },
    },
    {
      name: "Schools & Tutors", price: "Custom", period: "", border: "1px solid rgba(23,59,76,.12)", bg: "#173b4c", textColor: "#ffffff", perkColor: "rgba(255,255,255,.75)",
      perks: ["Class-wide progress dashboards", "Bulk student accounts", "Dedicated onboarding support"],
      cta: "Contact us", href: "/contact", ctaStyle: { background: "#e2793c", color: "#fff" },
    },
  ];
}

export default function Pricing() {
  const TIERS = buildTiers();
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "linear-gradient(180deg,#eef8f3 0%,#faf9f6 22%,#faf9f6 100%)", color: "#12181b", minHeight: "100vh" }}>
      <style>{`
        a{text-decoration:none}
        *{box-sizing:border-box}
        .tier-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;text-align:left}
        .tier-cta{display:block;text-align:center;font-size:14px;font-weight:700;padding:13px;border-radius:9px}
        @media(max-width:860px){.tier-grid{grid-template-columns:1fr}}
        @media(max-width:640px){
          .pricing-hero{padding:56px 20px 64px !important}
          .pricing-h1{font-size:29px !important}
        }
      `}</style>
      <MarketingNav current="pricing" />
      <section className="pricing-hero" style={{ maxWidth: 1240, margin: "0 auto", padding: "88px 32px 96px", textAlign: "center" }}>
        <h1 className="pricing-h1" style={{ fontFamily: "'Sora', sans-serif", fontSize: 42, fontWeight: 700, color: "#12181b", margin: "0 0 14px", letterSpacing: "-0.02em" }}>Simple pricing for serious revision</h1>
        <p style={{ fontSize: 16, color: "#5b6b6f", margin: "0 0 56px" }}>Start free. Upgrade whenever you&apos;re ready for unlimited practice.</p>
        <div className="tier-grid">
          {TIERS.map(tier => (
            <div key={tier.name} style={{ borderRadius: 18, padding: 36, border: tier.border, background: tier.bg, position: "relative" }}>
              {tier.badge && (
                <div style={{ position: "absolute", top: -13, left: 28, background: "#1f9d7c", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6, letterSpacing: ".03em" }}>
                  {tier.badge}
                </div>
              )}
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 19, fontWeight: 700, color: tier.textColor, marginBottom: 6 }}>{tier.name}</div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 36, fontWeight: 800, color: tier.textColor, marginBottom: 22 }}>
                {tier.price}<span style={{ fontSize: 14, fontWeight: 600, opacity: .6 }}>{tier.period}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                {tier.perks.map(perk => (
                  <div key={perk} style={{ fontSize: 14, color: tier.perkColor, display: "flex", gap: 8 }}><span>—</span>{perk}</div>
                ))}
              </div>
              <a href={tier.href} className="tier-cta" style={tier.ctaStyle}>{tier.cta}</a>
            </div>
          ))}
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
