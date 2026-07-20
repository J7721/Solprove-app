"use client";
import { useEffect, useRef, useState } from "react";

const row = (bg, color, label, code) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: bg, borderRadius: 9, padding: "10px 14px", fontSize: 12.5 }}>
    <span style={{ color: "#12181b" }}>{label}</span>
    <span style={{ fontWeight: 700, color }}>{code}</span>
  </div>
);

function UploadVisual() {
  return (
    <div style={{ background: "#ffffff", borderRadius: 14, overflow: "hidden", boxShadow: "0 20px 40px -16px rgba(23,59,76,.25)", width: "88%" }}>
      <div style={{ background: "#0f2740", padding: "10px 14px", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#e2793c" }} />
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f0c14b" }} />
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#1f9d7c" }} />
        <span style={{ marginLeft: 10, background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.55)", fontSize: 10.5, padding: "3px 10px", borderRadius: 5 }}>app.solprove.co.uk</span>
      </div>
      <div style={{ padding: 22 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: "#12181b", marginBottom: 8 }}>The question</div>
        <div style={{ background: "#faf9f6", border: "1px solid rgba(23,59,76,.12)", borderRadius: 8, padding: "10px 12px", fontSize: 12.5, color: "#12181b", marginBottom: 12 }}>
          Solve x² − 5x + 6 = 0
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ border: "1px solid rgba(23,59,76,.15)", borderRadius: 7, padding: "6px 10px", fontSize: 11, color: "#5b6b6f", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontWeight: 600, color: "#173b4c" }}>📎 Attach photo</span>
          </div>
          <div style={{ background: "#1f9d7c", color: "#fff", fontSize: 11, fontWeight: 700, padding: "7px 12px", borderRadius: 7, marginLeft: "auto" }}>Explain step-by-step</div>
        </div>
      </div>
    </div>
  );
}

function MarkingVisual() {
  return (
    <div style={{ background: "#ffffff", borderRadius: 14, padding: 22, boxShadow: "0 20px 40px -16px rgba(23,59,76,.25)", width: "88%" }}>
      <div style={{ fontSize: 12, color: "#5b6b6f", marginBottom: 12 }}>
        <strong style={{ color: "#12181b" }}>Q. A right triangle has sides 6 cm and 8 cm.</strong> Find the hypotenuse.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
        {row("rgba(31,157,124,.12)", "#157a61", "Sets up 6² + 8² = 36 + 64", "M1 ✓")}
        {row("rgba(226,121,60,.14)", "#c9622e", "Wrote 18 cm; the correct answer is 10 cm", "A0 ✕")}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(23,59,76,.1)", paddingTop: 12 }}>
        <span style={{ background: "#12181b", color: "#3ddc97", fontSize: 10, fontWeight: 700, letterSpacing: ".04em", padding: "5px 10px", borderRadius: 100 }}>MARKED LIKE AN EXAMINER</span>
        <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 800, color: "#12181b" }}>1/2 marks</span>
      </div>
    </div>
  );
}

function SolutionVisual() {
  return (
    <div style={{ background: "#ffffff", borderRadius: 14, padding: 22, boxShadow: "0 20px 40px -16px rgba(23,59,76,.25)", width: "88%" }}>
      <div style={{ fontSize: 11.5, color: "#5b6b6f", marginBottom: 12 }}>
        I understood: <b style={{ color: "#12181b" }}>Solve 2x² + 5x − 3 = 0</b>{" "}
        <span style={{ background: "rgba(31,157,124,.12)", color: "#157a61", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 99, marginLeft: 4 }}>Spec ref A18</span>
      </div>
      {[
        { explain: "Factorise: find two brackets that expand back", working: "(2x − 1)(x + 3) = 0" },
        { explain: "Set each bracket to zero", working: "x = 0.5  or  x = −3" },
      ].map((s, i) => (
        <div key={i} style={{ borderLeft: "3px solid #1f9d7c", padding: "5px 12px", margin: "9px 0" }}>
          <div style={{ fontSize: 11, color: "#5b6b6f" }}>{s.explain}</div>
          <div style={{ fontWeight: 700, fontFamily: "monospace", fontSize: 13, color: "#12181b" }}>{s.working}</div>
        </div>
      ))}
      <div style={{ fontSize: 12.5, color: "#12181b", marginTop: 10 }}><b>Answer: x = 0.5 or x = −3</b></div>
    </div>
  );
}

function PracticeVisual() {
  return (
    <div style={{ background: "#ffffff", borderRadius: 14, padding: 22, boxShadow: "0 20px 40px -16px rgba(23,59,76,.25)", width: "88%" }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: "#12181b", marginBottom: 10 }}>Focus areas</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        <span style={{ background: "rgba(226,121,60,.14)", color: "#c9622e", fontSize: 10.5, fontWeight: 700, padding: "5px 10px", borderRadius: 99 }}>A18 Quadratics: 58%</span>
        <span style={{ background: "rgba(226,121,60,.14)", color: "#c9622e", fontSize: 10.5, fontWeight: 700, padding: "5px 10px", borderRadius: 99 }}>G20 Pythagoras: 50%</span>
      </div>
      <div style={{ background: "rgba(31,157,124,.08)", border: "1px dashed rgba(31,157,124,.35)", borderRadius: 10, padding: 14 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: "#157a61", marginBottom: 6 }}>🎯 NEXT UP — TARGETS G20</div>
        <div style={{ fontSize: 12.5, color: "#12181b" }}>A right triangle has sides 9 cm and 12 cm. Find the hypotenuse.</div>
      </div>
    </div>
  );
}

function ProgressVisual() {
  const topics = [
    { ref: "A17", title: "Linear equations", pct: 82 },
    { ref: "A18", title: "Quadratic equations", pct: 58 },
    { ref: "G20", title: "Pythagoras' theorem", pct: 50 },
  ];
  return (
    <div style={{ background: "#ffffff", borderRadius: 14, padding: 22, boxShadow: "0 20px 40px -16px rgba(23,59,76,.25)", width: "88%" }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: "#12181b", marginBottom: 14 }}>Topic mastery</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {topics.map(t => (
          <div key={t.ref}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 4 }}>
              <span style={{ color: "#12181b", fontWeight: 600 }}>{t.ref} {t.title}</span>
              <span style={{ color: "#5b6b6f" }}>{t.pct}%</span>
            </div>
            <div style={{ background: "#f1f0ea", borderRadius: 99, height: 7 }}>
              <div style={{ width: `${t.pct}%`, background: t.pct < 70 ? "#e2793c" : "#1f9d7c", height: 7, borderRadius: 99 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GradeVisual() {
  return (
    <div style={{ background: "#ffffff", borderRadius: 14, padding: 22, boxShadow: "0 20px 40px -16px rgba(23,59,76,.25)", width: "88%" }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: "#12181b", marginBottom: 16 }}>Estimated grade</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: "#1f9d7c", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 800, flexShrink: 0 }}>
          6
        </div>
        <div>
          <div style={{ fontSize: 12.5, color: "#12181b", fontWeight: 600 }}>Currently tracking a grade 6</div>
          <div style={{ fontSize: 10.5, color: "#5b6b6f", marginTop: 3 }}>Based on 68% accuracy across marked questions</div>
        </div>
      </div>
      <div style={{ fontSize: 9.5, color: "#93a0a3", marginTop: 14, borderTop: "1px solid rgba(23,59,76,.08)", paddingTop: 10 }}>
        Estimate only — not an official exam board prediction.
      </div>
    </div>
  );
}

function ErrorDnaVisual() {
  const mistakes = [
    { label: "Sign errors", pct: 38 },
    { label: "Arithmetic slips", pct: 27 },
    { label: "Wrong method chosen", pct: 19 },
    { label: "Working not fully shown", pct: 11 },
  ];
  return (
    <div style={{ background: "#ffffff", borderRadius: 14, padding: 22, boxShadow: "0 20px 40px -16px rgba(23,59,76,.25)", width: "88%" }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: "#12181b", marginBottom: 4 }}>Your error DNA</div>
      <div style={{ fontSize: 10, color: "#5b6b6f", marginBottom: 14 }}>Where you're actually losing marks</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {mistakes.map(m => (
          <div key={m.label}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
              <span style={{ color: "#12181b", fontWeight: 600 }}>{m.label}</span>
              <span style={{ color: "#5b6b6f" }}>{m.pct}%</span>
            </div>
            <div style={{ background: "#f1f0ea", borderRadius: 99, height: 7 }}>
              <div style={{ width: `${m.pct}%`, background: "#e2793c", height: 7, borderRadius: 99 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const FEATURES = [
  { num: "01", title: "Upload your work", desc: "Snap a photo or upload a PDF of the question and your attempt — typed or handwritten, it doesn't matter.", Visual: UploadVisual },
  { num: "02", title: "Instant marking", desc: "Solprove checks every line of your working and flags exactly which step went wrong, not just the final answer.", Visual: MarkingVisual },
  { num: "03", title: "Full worked solutions", desc: "See the complete method laid out clearly, so you understand the “why” behind every step.", Visual: SolutionVisual },
  { num: "04", title: "Personalised practice", desc: "Get similar questions that target the exact topic you slipped up on, not a random mixed set.", Visual: PracticeVisual },
  { num: "05", title: "Progress tracking", desc: "Watch your mastery of every GCSE topic grow over time, with a clear view of what to revise next.", Visual: ProgressVisual },
  { num: "06", title: "Estimated grade", desc: "See a live estimated grade based on your marked-question accuracy — not a vague progress bar, an actual number to track.", Visual: GradeVisual },
  { num: "07", title: "Your error DNA", desc: "Not just which topics you're weak on — exactly why you're losing marks, from sign errors to incomplete working.", Visual: ErrorDnaVisual },
];

export default function FeatureCarousel() {
  const [slide, setSlide] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSlide(s => (s + 1) % FEATURES.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  function next() { setSlide(s => (s + 1) % FEATURES.length); }
  function prev() { setSlide(s => (s - 1 + FEATURES.length) % FEATURES.length); }

  return (
    <section id="feature-carousel" className="carousel-section" style={{ maxWidth: 1240, margin: "0 auto", padding: "96px 32px" }}>
      <style>{`
        .carousel-slide{display:grid;grid-template-columns:1fr 1fr;gap:0;align-items:center;background:#f1f0ea;border-radius:18px;min-height:380px}
        .carousel-text{padding:52px}
        .carousel-visual{width:100%;height:380px;border-radius:0 18px 18px 0;background:#e4e2da;display:flex;align-items:center;justify-content:center;padding:24px}
        .carousel-arrow{width:44px;height:44px;font-size:18px}
        @media(max-width:760px){
          .carousel-section{padding:56px 16px !important}
          .carousel-slide{grid-template-columns:1fr;min-height:auto}
          .carousel-text{padding:28px 24px 22px}
          .carousel-text h3{font-size:21px !important;margin:0 0 10px !important}
          .carousel-text p{font-size:14.5px !important}
          .carousel-visual{height:auto;padding:20px 16px 28px;border-radius:0 0 18px 18px}
          .carousel-arrow{width:36px !important;height:36px !important;font-size:15px !important}
          .carousel-row{gap:8px !important}
        }
      `}</style>
      <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto 40px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1f9d7c", letterSpacing: ".06em", marginBottom: 12 }}>EVERYTHING THE PROGRAM DOES</div>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 32, fontWeight: 700, color: "#12181b", margin: 0, letterSpacing: "-0.01em" }}>See Solprove in action</h2>
      </div>

      <div className="carousel-row" style={{ position: "relative", display: "flex", alignItems: "center", gap: 20 }}>
        <button onClick={prev} aria-label="Previous" className="carousel-arrow" style={{ borderRadius: "50%", border: "1px solid rgba(23,59,76,.15)", background: "#ffffff", color: "#173b4c", cursor: "pointer", flex: "none", boxShadow: "0 4px 12px rgba(23,59,76,.06)" }}>←</button>

        <div style={{ flex: 1, overflow: "hidden", borderRadius: 18, minWidth: 0 }}>
          <div style={{ display: "flex", width: `${FEATURES.length * 100}%`, transform: `translateX(-${slide * (100 / FEATURES.length)}%)`, transition: "transform .55s cubic-bezier(.4,0,.2,1)" }}>
            {FEATURES.map(f => {
              const Visual = f.Visual;
              const slideWidth = `${100 / FEATURES.length}%`;
              return (
                <div key={f.num} className="carousel-slide" style={{ flex: `0 0 ${slideWidth}`, width: slideWidth }}>
                  <div className="carousel-text">
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "#1f9d7c", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 20 }}>{f.num}</div>
                    <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 700, color: "#12181b", margin: "0 0 14px", letterSpacing: "-0.01em" }}>{f.title}</h3>
                    <p style={{ fontSize: 16, lineHeight: 1.6, color: "#5b6b6f", margin: 0 }}>{f.desc}</p>
                  </div>
                  <div className="carousel-visual">
                    <Visual />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button onClick={next} aria-label="Next" className="carousel-arrow" style={{ borderRadius: "50%", border: "1px solid rgba(23,59,76,.15)", background: "#ffffff", color: "#173b4c", cursor: "pointer", flex: "none", boxShadow: "0 4px 12px rgba(23,59,76,.06)" }}>→</button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 28 }}>
        {FEATURES.map((f, i) => (
          <div key={f.num} onClick={() => setSlide(i)} style={{ width: i === slide ? 22 : 8, height: 8, borderRadius: 4, background: i === slide ? "#1f9d7c" : "#d8ddd8", transition: "all .25s", cursor: "pointer" }} />
        ))}
      </div>
    </section>
  );
}
