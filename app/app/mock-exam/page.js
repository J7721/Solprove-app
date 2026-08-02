"use client";
import { useEffect, useRef, useState } from "react";
import { getToken } from "../../../lib/supabaseBrowser";
import { LAUNCHED } from "../../../lib/launch";
import ComingSoon from "../../components/ComingSoon";

async function authHeaders() {
  const t = await getToken();
  return { "Content-Type": "application/json", ...(t ? { Authorization: `Bearer ${t}` } : {}) };
}

// Same HEIC-safe conversion used in the main workspace — see app/app/page.js for details.
function fileToJpegBase64(file, maxDim = 1600, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve({ base64: canvas.toDataURL("image/jpeg", quality).split(",")[1], type: "image/jpeg" });
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("unsupported image format")); };
    img.src = url;
  });
}

const card = { background: "#fff", border: "1px solid rgba(23,59,76,.08)", boxShadow: "0 1px 3px rgba(23,59,76,.05)", borderRadius: 16, padding: 32, marginBottom: 24 };
const btn = (bg = "#1f9d7c") => ({ background: bg, color: "#fff", border: "none", borderRadius: 9, padding: "13px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Inter', sans-serif" });
const btnGhost = { background: "#fff", color: "#173b4c", border: "1px solid rgba(23,59,76,.18)", borderRadius: 9, padding: "13px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Inter', sans-serif" };
const ta = { width: "100%", padding: 16, borderRadius: 10, border: "1px solid rgba(23,59,76,.15)", fontSize: 15, color: "#12181b", resize: "vertical", background: "#faf9f6", fontFamily: "inherit", boxSizing: "border-box" };
const chip = (bg, color) => ({ background: bg, color, padding: "3px 11px", borderRadius: 99, fontSize: 12, fontWeight: 700 });
const sectionLabel = { fontFamily: "'Sora', sans-serif", fontSize: 17, fontWeight: 700, color: "#12181b" };

// "Quick" is sized to fit inside the free daily 5-mark allowance so anyone can try a
// mock exam without paying; "Full" intentionally needs Premium (matches the workspace's
// own free/paid split).
const LENGTHS = [
  { key: "quick", label: "Quick check", count: 5, blurb: "5 questions · ~12 minutes · free" },
  { key: "full", label: "Full mock", count: 14, blurb: "14 questions · ~35 minutes · Premium" },
];

function RedPen({ img, awards, steps }) {
  if (!img) return null;
  const anyPositioned = awards?.some((a) => a.step_index != null && steps?.[a.step_index]?.y != null);
  if (!anyPositioned) return null;
  return (
    <div style={{ position: "relative", display: "inline-block", maxWidth: "100%", margin: "14px 0 20px", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(23,59,76,.1)" }}>
      <img src={`data:${img.type};base64,${img.base64}`} alt="Your attempt" style={{ display: "block", width: "100%", maxWidth: 460, height: "auto" }} />
      {awards.map((a, i) => {
        const y = a.step_index != null ? steps?.[a.step_index]?.y : null;
        if (y == null) return null;
        const markColor = a.earned ? "#1f9d7c" : "#c81e3a";
        return (
          <div key={i} title={a.reason} style={{
            position: "absolute", top: `${y}%`, right: 6, transform: "translateY(-50%)",
            width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,.88)", boxShadow: "0 1px 4px rgba(0,0,0,.25)",
            color: markColor, fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 14,
            border: `2px solid ${markColor}`,
          }}>
            {a.earned ? "✓" : "✗"}
          </div>
        );
      })}
    </div>
  );
}

export default function MockExam() {
  const [stage, setStage] = useState("setup"); // setup | exam | marking | results
  const [tier, setTier] = useState("foundation");
  const [lengthKey, setLengthKey] = useState("quick");
  const [paper, setPaper] = useState([]);
  const [answers, setAnswers] = useState({}); // { [questionId]: { attempt, image } }
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [needsSubscription, setNeedsSubscription] = useState(false);
  const timerRef = useRef(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (stage !== "exam") return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { clearInterval(timerRef.current); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [stage]);

  useEffect(() => {
    if (stage === "exam" && secondsLeft === 0 && !submittedRef.current) {
      submittedRef.current = true;
      submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, stage]);

  async function startExam() {
    setBusy(true); setError(null); setNeedsSubscription(false);
    const length = LENGTHS.find((l) => l.key === lengthKey);
    const res = await fetch(`/api/mock-exam?tier=${tier}&count=${length.count}`, { headers: await authHeaders() });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Couldn't start the mock exam.");
      setNeedsSubscription(Boolean(data.needsSubscription));
      return;
    }
    setPaper(data.paper);
    setAnswers({});
    setIndex(0);
    setSecondsLeft(data.suggestedMinutes * 60);
    submittedRef.current = false;
    setStage("exam");
  }

  async function subscribe() {
    const res = await fetch("/api/checkout", { method: "POST", headers: await authHeaders() });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert(data.error || "Could not start checkout — are you signed in?");
  }

  function setAnswer(id, patch) {
    setAnswers((a) => ({ ...a, [id]: { ...(a[id] || { attempt: "", image: null }), ...patch } }));
  }

  async function onPhoto(id, e) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const { base64, type } = await fileToJpegBase64(f);
      setAnswer(id, { image: { base64, type, name: f.name } });
    } catch {
      alert("Sorry, that photo couldn't be opened. Try a different photo, or a JPEG/PNG file.");
    }
  }

  async function submit() {
    clearInterval(timerRef.current);
    setStage("marking"); setError(null);
    const payload = {
      tier,
      answers: paper.map((q) => ({
        questionId: q.id,
        attempt: answers[q.id]?.attempt || "",
        attemptImageBase64: answers[q.id]?.image?.base64,
        attemptImageType: answers[q.id]?.image?.type,
      })),
    };
    const res = await fetch("/api/mock-exam", { method: "POST", headers: await authHeaders(), body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Marking failed."); setStage("exam"); return; }
    setResults(data);
    setStage("results");
  }

  function restart() {
    setStage("setup"); setResults(null); setError(null); setPaper([]); setAnswers({});
  }

  if (!LAUNCHED) return <ComingSoon />;

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const current = paper[index];
  const currentAnswer = current ? answers[current.id] || { attempt: "", image: null } : null;
  const answeredCount = paper.filter((q) => answers[q.id]?.attempt || answers[q.id]?.image).length;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 0 80px" }}>
      <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 30, fontWeight: 700, color: "#12181b", margin: "0 0 6px" }}>Mock exam</h1>
      <p style={{ fontSize: 15.5, color: "#5b6b6f", margin: "0 0 28px" }}>
        Original, exam-style questions, timed like the real thing — marked and red-penned like an examiner when you're done.
      </p>

      {error && (
        <div style={{ ...card, background: "rgba(226,121,60,.1)" }}>
          <p style={{ margin: needsSubscription ? "0 0 14px" : 0, color: "#c9622e" }}>{error}</p>
          {needsSubscription && <button style={btn()} onClick={subscribe}>Start free trial — £11.99/month after 7 days</button>}
        </div>
      )}

      {stage === "setup" && (
        <div style={card}>
          <div style={{ ...sectionLabel, marginBottom: 14 }}>Tier</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 26 }}>
            {["foundation", "higher"].map((t) => (
              <div key={t} onClick={() => setTier(t)} style={{
                flex: 1, textAlign: "center", padding: "12px 0", borderRadius: 9, cursor: "pointer", fontWeight: 700, fontSize: 14,
                background: tier === t ? "#1f9d7c" : "#f1f0ea", color: tier === t ? "#fff" : "#173b4c", textTransform: "capitalize",
              }}>{t}</div>
            ))}
          </div>

          <div style={{ ...sectionLabel, marginBottom: 14 }}>Length</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
            {LENGTHS.map((l) => (
              <div key={l.key} onClick={() => setLengthKey(l.key)} style={{
                border: lengthKey === l.key ? "2px solid #1f9d7c" : "1px solid rgba(23,59,76,.15)",
                borderRadius: 10, padding: "14px 18px", cursor: "pointer",
                background: lengthKey === l.key ? "rgba(31,157,124,.06)" : "#fff",
              }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#12181b" }}>{l.label}</div>
                <div style={{ fontSize: 13, color: "#5b6b6f", marginTop: 2 }}>{l.blurb}</div>
              </div>
            ))}
          </div>

          <button style={btn()} onClick={startExam} disabled={busy}>{busy ? "Building your paper…" : "Start mock exam"}</button>
        </div>
      )}

      {stage === "exam" && current && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: 13.5, color: "#5b6b6f", fontWeight: 600 }}>
              Question {index + 1} of {paper.length} · {answeredCount} answered
            </div>
            <div style={{
              fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 20,
              color: secondsLeft <= 60 ? "#c9622e" : "#12181b",
              background: "#fff", border: "1px solid rgba(23,59,76,.12)", borderRadius: 9, padding: "6px 16px",
            }}>{mm}:{ss}</div>
          </div>

          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
              <p style={{ fontSize: 17, fontWeight: 600, color: "#12181b", margin: 0, lineHeight: 1.5 }}>{current.question}</p>
              <span style={{ ...chip("rgba(31,157,124,.12)", "#157a61"), whiteSpace: "nowrap", flexShrink: 0 }}>{current.marks} mark{current.marks > 1 ? "s" : ""}</span>
            </div>

            <textarea rows={4} style={ta} placeholder="Show your working…" value={currentAnswer.attempt}
              onChange={(e) => setAnswer(current.id, { attempt: e.target.value })} />

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14, flexWrap: "wrap" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#5b6b6f", border: "1px solid rgba(23,59,76,.15)", padding: "9px 14px", borderRadius: 9, cursor: "pointer" }}>
                <span style={{ fontWeight: 600, color: "#173b4c" }}>Attach photo</span>
                <span>{currentAnswer.image ? currentAnswer.image.name : "no file selected"}</span>
                <input type="file" accept="image/*" onChange={(e) => onPhoto(current.id, e)} style={{ display: "none" }} />
              </label>
              {currentAnswer.image && (
                <button onClick={() => setAnswer(current.id, { image: null })} style={{ background: "none", border: "none", color: "#c9622e", fontSize: 12.5, fontWeight: 600, cursor: "pointer", padding: 0 }}>
                  Remove photo
                </button>
              )}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <button style={btnGhost} onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>← Previous</button>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={btnGhost} onClick={submit}>Finish exam</button>
              {index < paper.length - 1 && (
                <button style={btn()} onClick={() => setIndex((i) => Math.min(paper.length - 1, i + 1))}>Next →</button>
              )}
            </div>
          </div>
        </>
      )}

      {stage === "marking" && (
        <div style={{ ...card, textAlign: "center", padding: 50 }}>
          <p style={{ fontSize: 16, color: "#12181b", fontWeight: 600, margin: 0 }}>Marking your paper like an examiner…</p>
          <p style={{ fontSize: 13.5, color: "#5b6b6f", marginTop: 8 }}>This checks every answer against its rubric — usually takes under a minute.</p>
        </div>
      )}

      {stage === "results" && results && (
        <>
          <div style={{ ...card, textAlign: "center", background: "#0f2740" }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 42, fontWeight: 800, color: "#fff" }}>
              {results.totalScore} / {results.totalOutOf}
            </div>
            <div style={{ color: "rgba(255,255,255,.7)", fontSize: 14.5, marginTop: 6 }}>
              {results.totalOutOf ? Math.round((results.totalScore / results.totalOutOf) * 100) : 0}% on this mock paper
            </div>
          </div>

          {results.results.map((r, i) => (
            <div key={i} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#12181b", margin: 0 }}>{i + 1}. {r.question}</p>
                <span style={{ ...chip(r.score === r.out_of ? "rgba(31,157,124,.12)" : "rgba(226,121,60,.12)", r.score === r.out_of ? "#157a61" : "#c9622e"), whiteSpace: "nowrap", flexShrink: 0 }}>
                  {r.score}/{r.out_of}
                </span>
              </div>

              {r.skipped ? (
                <p style={{ fontSize: 13.5, color: "#5b6b6f", margin: 0 }}>{r.summary}</p>
              ) : (
                <>
                  <RedPen img={r.attemptImageBase64 ? { base64: r.attemptImageBase64, type: r.attemptImageType } : null} awards={r.awards} steps={r.extracted?.steps} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {r.awards?.map((a, j) => (
                      <div key={j} style={{ display: "flex", justifyContent: "space-between", background: a.earned ? "rgba(31,157,124,.08)" : "rgba(226,121,60,.1)", padding: "8px 12px", borderRadius: 8, fontSize: 13 }}>
                        <span style={{ color: "#12181b" }}>{a.reason}</span>
                        <b style={{ color: a.earned ? "#157a61" : "#c9622e", marginLeft: 10, whiteSpace: "nowrap" }}>{a.code} {a.earned ? "✓" : "✗"}</b>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 13.5, color: "#5b6b6f", marginTop: 10, marginBottom: 0 }}>{r.summary}</p>
                </>
              )}
            </div>
          ))}

          <div style={{ display: "flex", gap: 10 }}>
            <a href="/app" style={{ ...btnGhost, textDecoration: "none", display: "inline-block" }}>Back to workspace</a>
            <button style={btn()} onClick={restart}>New mock exam</button>
          </div>
        </>
      )}
    </div>
  );
}
