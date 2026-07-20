import MarketingNav from "../components/MarketingNav";
import MarketingFooter from "../components/MarketingFooter";

export const metadata = { title: "About — Solprove" };

const VALUES = [
  { title: "Clarity", desc: "Every explanation shows the full method — no shortcuts, no skipped steps." },
  { title: "Rigor", desc: "Marking is checked against real GCSE mark schemes, step by step." },
  { title: "Accessibility", desc: "A revision tool that's there whenever a question comes up, not just office hours." },
];

export default function About() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "linear-gradient(180deg,#eef8f3 0%,#faf9f6 22%,#faf9f6 100%)", color: "#12181b", minHeight: "100vh" }}>
      <style>{`
        *{box-sizing:border-box}
        .about-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:32px}
        @media(max-width:700px){.about-grid{grid-template-columns:1fr}}
        @media(max-width:640px){
          .about-hero{padding:52px 20px 32px !important}
          .about-h1{font-size:27px !important}
        }
      `}</style>
      <MarketingNav current="about" />

      <section className="about-hero" style={{ maxWidth: 900, margin: "0 auto", padding: "88px 32px 40px", textAlign: "center" }}>
        <h1 className="about-h1" style={{ fontFamily: "'Sora', sans-serif", fontSize: 42, fontWeight: 700, color: "#12181b", margin: "0 0 22px", letterSpacing: "-0.02em" }}>
          Built by a solo founder who&apos;s marked a lot of GCSE Maths
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.7, color: "#5b6b6f", margin: 0 }}>
          Solprove started with a simple frustration: students can get a final answer wrong and never find out which step broke down.
          I built the marking process I wished every student had access to — patient, specific, and available at 11pm the night before a mock.
        </p>
      </section>

      <section style={{ background: "#f1f0ea", padding: "80px 0" }}>
        <div className="about-grid" style={{ maxWidth: 1000, margin: "0 auto", padding: "0 32px" }}>
          {VALUES.map(v => (
            <div key={v.title}>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 19, fontWeight: 700, color: "#12181b", margin: "0 0 10px" }}>{v.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "#5b6b6f", margin: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 32px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 700, color: "#12181b", margin: "0 0 14px" }}>Where we&apos;re headed</h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#5b6b6f", margin: 0 }}>
          GCSE Maths today, with A-Level Maths and other GCSE subjects on the way — same step-by-step marking, wherever your exam board takes you.
        </p>
      </section>

      <MarketingFooter />
    </div>
  );
}
