import MarketingNav from "./components/MarketingNav";
import MarketingFooter from "./components/MarketingFooter";
import FeatureCarousel from "./components/FeatureCarousel";
import { LAUNCHED, WAITLIST_HREF } from "../lib/launch";

export default function Home() {
  const heroCta = LAUNCHED
    ? { label: "Start free trial", href: "/app" }
    : { label: "Coming Soon - Join The Waitlist", href: WAITLIST_HREF };
  const finalCta = LAUNCHED
    ? { label: "Start free trial", href: "/app", sub: "Your first 5 questions are free — no card required." }
    : { label: "Coming Soon - Join The Waitlist", href: WAITLIST_HREF, sub: "Be the first to know the moment we launch." };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "linear-gradient(180deg,#eef8f3 0%,#faf9f6 22%,#faf9f6 100%)", color: "#12181b" }}>
      <style>{`
        a{color:#1f9d7c;text-decoration:none}
        *{box-sizing:border-box}
        html{scroll-behavior:smooth}
        @media(max-width:900px){
          .hero-grid{grid-template-columns:1fr !important}
        }
      `}</style>

      <MarketingNav current="home" />

      {/* HERO */}
      <section style={{ background: "linear-gradient(160deg,#0c2038 0%,#123157 55%,#0c2038 100%)", padding: "88px 0 100px" }}>
        <div className="hero-grid" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px", display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 56, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.85)", fontSize: 13, fontWeight: 700, padding: "9px 18px", borderRadius: 100, marginBottom: 26 }}>
              🇬🇧 Built for UK GCSE Maths · Launching September
            </div>
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 52, lineHeight: 1.1, fontWeight: 800, color: "#ffffff", margin: "0 0 26px", letterSpacing: "-0.02em" }}>
              Solve it to prove.<br /><span style={{ color: "#3ddc97" }}>Every time.</span>
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "rgba(255,255,255,.82)", margin: "0 0 18px", maxWidth: 520 }}>
              The AI maths tutor that marks like a real examiner — your child photographs their GCSE maths homework, works through it, and <strong style={{ color: "#3ddc97" }}>proves</strong> they&apos;ve got it.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,.55)", margin: "0 0 34px", maxWidth: 520 }}>
              Step-by-step help matched to the GCSE Maths curriculum, plus a weekly report showing exactly where they&apos;re improving.
            </p>
            <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", marginBottom: 20 }}>
              <a href={heroCta.href} style={{ background: "#1f9d7c", color: "#ffffff", fontSize: 15, fontWeight: 700, padding: "16px 28px", borderRadius: 10, boxShadow: "0 8px 20px rgba(31,157,124,.35)" }}>
                {heroCta.label}
              </a>
              <a href="#feature-carousel" style={{ color: "#ffffff", fontSize: 15, fontWeight: 700, padding: "16px 26px", borderRadius: 10, border: "1px solid rgba(255,255,255,.3)" }}>
                How it works
              </a>
            </div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", margin: 0 }}>£11.99/month at launch · 7-day free trial · Cancel in two clicks, always</p>
          </div>
          <div style={{ background: "#ffffff", borderRadius: 20, padding: 32, boxShadow: "0 30px 60px -20px rgba(0,0,0,.4)" }}>
            <div style={{ fontSize: 14, lineHeight: 1.5, color: "#12181b", marginBottom: 20 }}>
              <strong>Q7. Solve <em style={{ fontStyle: "normal" }}>x² − 5x + 6 = 0</em></strong> · <strong>Maya&apos;s answer:</strong> x = 2, x = 3<br />
              <span style={{ color: "#5b6b6f" }}>(working shown)</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(31,157,124,.12)", borderRadius: 10, padding: "14px 16px" }}>
                <span style={{ fontSize: 14, color: "#12181b" }}>Factorising method chosen correctly</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#157a61" }}>M1 ✓</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(31,157,124,.12)", borderRadius: 10, padding: "14px 16px" }}>
                <span style={{ fontSize: 14, color: "#12181b" }}>Correct factors (x−2)(x−3)</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#157a61" }}>M1 ✓</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(226,121,60,.14)", borderRadius: 10, padding: "14px 16px" }}>
                <span style={{ fontSize: 14, color: "#12181b" }}>Final answers stated — one sign slip in working</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#c9622e" }}>A0 ✕</span>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(23,59,76,.1)", paddingTop: 18 }}>
              <span style={{ background: "#12181b", color: "#3ddc97", fontSize: 12, fontWeight: 700, letterSpacing: ".04em", padding: "8px 14px", borderRadius: 100 }}>MARKED LIKE AN EXAMINER</span>
              <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 800, color: "#12181b" }}>2/3 marks</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section style={{ background: "#173b4c", padding: "22px 0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px", display: "flex", justifyContent: "center", gap: 56, flexWrap: "wrap" }}>
          {["Aligned to the UK GCSE Maths curriculum, with more subjects coming soon", "Full worked solutions and reports, not just answers", "Free to start — no card required"].map((t, i) => (
            <div key={i} style={{ color: "rgba(255,255,255,.82)", fontSize: 14, fontWeight: 600, letterSpacing: ".01em" }}>{t}</div>
          ))}
        </div>
      </section>

      {/* FEATURE CAROUSEL */}
      <FeatureCarousel />

      {/* THREE STEPS */}
      <section style={{ background: "#f1f0ea", padding: "96px 0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 56px" }}>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 34, fontWeight: 700, color: "#12181b", margin: "0 0 14px", letterSpacing: "-0.01em" }}>Three steps to a better mark</h2>
            <p style={{ fontSize: 16, color: "#5b6b6f", margin: 0 }}>No setup, no scanning apps — just a question and a photo.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }}>
            {[
              { n: "STEP 1", t: "Upload", d: "Photo or PDF of the question and your attempt." },
              { n: "STEP 2", t: "Get instant feedback", d: "See exactly which step needs work." },
              { n: "STEP 3", t: "Practice smarter", d: "Work through questions built around your gaps." },
            ].map(s => (
              <div key={s.n} style={{ background: "#faf9f6", borderRadius: 16, padding: 36, border: "1px solid rgba(23,59,76,.08)" }}>
                <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: "#e2793c", marginBottom: 16 }}>{s.n}</div>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 700, color: "#12181b", margin: "0 0 10px" }}>{s.t}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: "#5b6b6f", margin: 0 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "96px 32px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 38, fontWeight: 700, color: "#12181b", margin: "0 0 16px", letterSpacing: "-0.01em" }}>Ready to see your marks improve?</h2>
        <p style={{ fontSize: 17, color: "#5b6b6f", margin: "0 0 32px" }}>{finalCta.sub}</p>
        <a href={finalCta.href} style={{ background: "#1f9d7c", color: "#ffffff", fontSize: 16, fontWeight: 700, padding: "16px 32px", borderRadius: 10, boxShadow: "0 8px 20px rgba(31,157,124,.28)", display: "inline-block" }}>
          {finalCta.label}
        </a>
      </section>

      <MarketingFooter />
    </div>
  );
}
