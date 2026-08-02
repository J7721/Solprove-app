"use client";
import { useEffect, useState } from "react";
import { getToken } from "../../lib/supabaseBrowser";
import { LAUNCHED } from "../../lib/launch";
import ComingSoon from "../components/ComingSoon";

async function authHeaders() {
  const t = await getToken();
  return { "Content-Type": "application/json", ...(t ? { Authorization: `Bearer ${t}` } : {}) };
}

// Converts any uploaded photo — including iPhone HEIC/HEIC, which Claude's vision
// API can't read directly — into a JPEG the API accepts. Also downscales huge
// camera photos so uploads stay fast. Safari decodes HEIC natively via <img>,
// which is what makes this work without a separate conversion library.
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
const ta = { width: "100%", padding: 16, borderRadius: 10, border: "1px solid rgba(23,59,76,.15)", fontSize: 15, color: "#12181b", resize: "vertical", background: "#faf9f6", fontFamily: "inherit", boxSizing: "border-box" };
const chip = (bg, color) => ({ background: bg, color, padding: "3px 11px", borderRadius: 99, fontSize: 12, fontWeight: 700 });
const sectionLabel = { fontFamily: "'Sora', sans-serif", fontSize: 17, fontWeight: 700, color: "#12181b" };
const segBtn = (active) => ({ padding: "8px 16px", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", color: active ? "#ffffff" : "#173b4c", background: active ? "#1f9d7c" : "transparent" });

export default function Workspace() {
  const [question, setQuestion] = useState("");
  const [questionId, setQuestionId] = useState(null); // set when question came from the bank
  const [attempt, setAttempt] = useState("");
  const [tier, setTier] = useState("foundation");
  const [image, setImage] = useState(null);
  const [attemptImage, setAttemptImage] = useState(null);
  const [solution, setSolution] = useState(null);
  const [marking, setMarking] = useState(null);
  const [progress, setProgress] = useState(null);
  const [busy, setBusy] = useState("");

  async function refreshProgress() {
    const res = await fetch("/api/practice", { method: "POST", headers: await authHeaders(), body: JSON.stringify({ tier }) });
    setProgress(await res.json());
  }
  useEffect(() => { if (LAUNCHED) refreshProgress(); }, []);

  async function onFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const { base64, type } = await fileToJpegBase64(f);
      setImage({ base64, type, name: f.name });
      setQuestionId(null);
    } catch {
      alert("Sorry, that photo couldn't be opened. Try a different photo, or a JPEG/PNG file.");
    }
  }

  async function onAttemptFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const { base64, type } = await fileToJpegBase64(f);
      setAttemptImage({ base64, type, name: f.name });
    } catch {
      alert("Sorry, that photo couldn't be opened. Try a different photo, or a JPEG/PNG file.");
    }
  }

  async function solve() {
    setBusy("solve"); setSolution(null); setMarking(null);
    const res = await fetch("/api/solve", { method: "POST", headers: await authHeaders(),
      body: JSON.stringify({ question, tier, imageBase64: image?.base64, imageType: image?.type }) });
    setSolution(await res.json()); setBusy("");
  }

  async function mark() {
    setBusy("mark"); setMarking(null);
    const q = questionId ? question : (solution?.question_understood || question);
    const res = await fetch("/api/mark", { method: "POST", headers: await authHeaders(),
      body: JSON.stringify({ question: q, attempt, tier, questionId, attemptImageBase64: attemptImage?.base64, attemptImageType: attemptImage?.type }) });
    setMarking(await res.json()); setBusy("");
    refreshProgress();
  }

  async function subscribe() {
    const res = await fetch("/api/checkout", { method: "POST", headers: await authHeaders() });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert(data.error || "Could not start checkout — are you signed in?");
  }

  async function practice() {
    setBusy("practice"); setSolution(null); setMarking(null); setAttempt(""); setImage(null); setAttemptImage(null);
    const res = await fetch("/api/practice", { method: "POST", headers: await authHeaders(), body: JSON.stringify({ tier }) });
    const data = await res.json();
    setProgress(data);
    if (data.question) { setQuestion(data.question.question); setQuestionId(data.question.id); }
    setBusy("");
    document.getElementById("question-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToProgress() {
    document.getElementById("progress-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!LAUNCHED) return <ComingSoon />;

  const totalAttempts = progress?.progress?.reduce((sum, t) => sum + (t.attempts || 0), 0) || 0;

  const sidebarItems = [
    { label: "Ask a question", active: true, onClick: () => document.getElementById("question-card")?.scrollIntoView({ behavior: "smooth" }) },
    { label: "Practice weak spots", active: false, onClick: practice },
    { label: "Mock exam", active: false, onClick: () => { window.location.href = "/app/mock-exam"; } },
    { label: "Friends", active: false, onClick: () => { window.location.href = "/app/friends"; } },
    { label: "Progress", active: false, onClick: scrollToProgress },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 40, padding: "48px 0 80px" }}>
      {/* SIDEBAR */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {sidebarItems.map((item, i) => (
          <div key={i} onClick={item.onClick} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 9,
            fontSize: 14, fontWeight: item.active ? 700 : 500, cursor: "pointer",
            color: item.active ? "#12181b" : "#5b6b6f",
            background: item.active ? "#ffffff" : "transparent",
            border: item.active ? "1px solid rgba(23,59,76,.08)" : "1px solid transparent",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: item.active ? "#1f9d7c" : "rgba(23,59,76,.25)" }} />
            {item.label}
          </div>
        ))}
        <div style={{ marginTop: 24, padding: 18, background: "#ffffff", border: "1px solid rgba(23,59,76,.08)", borderRadius: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#1f9d7c", letterSpacing: ".04em", marginBottom: 10 }}>YOUR STATS</div>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 800, color: "#12181b", lineHeight: 1 }}>{totalAttempts}</div>
          <div style={{ fontSize: 12, color: "#5b6b6f", marginTop: 4 }}>questions marked so far</div>
        </div>
      </div>

      {/* MAIN */}
      <div>
        <div style={{ marginBottom: 34 }}>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 34, fontWeight: 700, color: "#12181b", margin: "0 0 10px", letterSpacing: "-0.01em" }}>Stuck on a question?</h1>
          <p style={{ fontSize: 16, color: "#5b6b6f", margin: 0 }}>Type it, photo it, or practise your weak spots — marked like an examiner, every time.</p>
        </div>

        {/* PROGRESS + INSIGHTS */}
        <div id="progress-panel">
        {progress?.progress?.length > 0 && (
          <div style={card}>
            <div style={sectionLabel}>Your progress</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
              {progress.progress.map(t => (
                <span key={t.ref} style={chip(t.accuracy < 0.7 ? "rgba(226,121,60,.14)" : "rgba(31,157,124,.12)", t.accuracy < 0.7 ? "#c9622e" : "#157a61")}>
                  {t.ref} {t.title}: {Math.round(t.accuracy * 100)}% ({t.attempts} tries)
                </span>
              ))}
            </div>
            {progress.weakTopics?.length > 0 && (
              <p style={{ fontSize: 13.5, color: "#c9622e", margin: "14px 0 0" }}>
                🎯 Focus areas: {progress.weakTopics.map(t => t.title).join(", ")}
              </p>
            )}
          </div>
        )}

        {/* ESTIMATED GRADE */}
        <div style={card}>
          <div style={sectionLabel}>Estimated grade</div>
          {progress?.grade ? (
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 16 }}>
              <div style={{ width: 60, height: 60, borderRadius: 16, background: "#1f9d7c", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 800, flexShrink: 0 }}>
                {progress.grade.grade}
              </div>
              <div>
                <div style={{ fontSize: 14.5, color: "#12181b", fontWeight: 600 }}>Currently tracking a grade {progress.grade.grade}</div>
                <div style={{ fontSize: 12.5, color: "#5b6b6f", marginTop: 4 }}>
                  Estimate based on {Math.round(progress.grade.accuracy * 100)}% accuracy across your marked questions — not an official prediction.
                </div>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 13.5, color: "#5b6b6f", margin: "10px 0 0" }}>
              Mark a few more questions ({progress?.overall?.attempts || 0}/5) to unlock your estimated grade.
            </p>
          )}
        </div>

        {/* ERROR DNA */}
        {progress?.mistakeDNA?.length > 0 && (
          <div style={card}>
            <div style={sectionLabel}>Your error DNA</div>
            <p style={{ fontSize: 13, color: "#5b6b6f", margin: "6px 0 16px" }}>Where you're actually losing marks, not just which topics.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {progress.mistakeDNA.slice(0, 5).map(m => (
                <div key={m.type}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                    <span style={{ color: "#12181b", fontWeight: 600 }}>{m.label}</span>
                    <span style={{ color: "#5b6b6f" }}>{Math.round(m.pct * 100)}%</span>
                  </div>
                  <div style={{ background: "#f1f0ea", borderRadius: 99, height: 8 }}>
                    <div style={{ width: `${Math.max(4, m.pct * 100)}%`, background: "#e2793c", height: 8, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>

        {/* QUESTION INPUT */}
        <div id="question-card" style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
            <div style={sectionLabel}>
              The question {questionId && <span style={{ ...chip("#e8ecff", "#3b4a8f"), marginLeft: 8 }}>from your practice bank</span>}
            </div>
            <a href="#" onClick={(e) => { e.preventDefault(); practice(); }} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(31,157,124,.1)", color: "#157a61", fontSize: 13, fontWeight: 700, padding: "9px 16px", borderRadius: 9, opacity: busy === "practice" ? 0.6 : 1 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#1f9d7c" }} />
              {busy === "practice" ? "Picking…" : "Practice my weak spots"}
            </a>
          </div>
          <textarea rows={4} style={ta} placeholder="e.g. Solve x² − 5x + 6 = 0" value={question}
            onChange={e => { setQuestion(e.target.value); setQuestionId(null); }} />
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18, flexWrap: "wrap" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#5b6b6f", border: "1px solid rgba(23,59,76,.15)", padding: "9px 14px", borderRadius: 9, cursor: "pointer" }}>
              <span style={{ fontWeight: 600, color: "#173b4c" }}>Attach photo or PDF</span>
              <span>{image ? image.name : "no file selected"}</span>
              <input type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
            </label>
            <div style={{ display: "flex", background: "#f1f0ea", borderRadius: 9, padding: 3, marginLeft: "auto" }}>
              <div onClick={() => setTier("foundation")} style={segBtn(tier === "foundation")}>Foundation</div>
              <div onClick={() => setTier("higher")} style={segBtn(tier === "higher")}>Higher</div>
            </div>
            <button style={btn()} onClick={solve} disabled={busy === "solve" || (!question && !image)}>
              {busy === "solve" ? "Thinking…" : "Explain step-by-step"}
            </button>
          </div>
        </div>

        {/* SOLUTION */}
        {solution && !solution.error && (
          <div style={card}>
            {solution.readable === false ? (
              <p style={{ margin: 0 }}>😅 I couldn't read that clearly — try a sharper photo or type the question.</p>
            ) : (
              <>
                <p style={{ fontSize: 13, color: "#5b6b6f", marginTop: 0 }}>
                  I understood: <b style={{ color: "#12181b" }}>{solution.question_understood}</b>{" "}
                  <span style={{ ...chip("rgba(31,157,124,.12)", "#157a61"), marginLeft: 6 }}>Spec ref {solution.spec_ref}</span>
                </p>
                {solution.steps?.map((s, i) => (
                  <div key={i} style={{ borderLeft: "3px solid #1f9d7c", padding: "6px 14px", margin: "10px 0" }}>
                    <div style={{ fontSize: 13.5, color: "#5b6b6f" }}>{s.explain}</div>
                    <div style={{ fontWeight: 700, fontFamily: "monospace", fontSize: 15, color: "#12181b" }}>{s.working}</div>
                  </div>
                ))}
                <p style={{ color: "#12181b" }}><b>Answer: {solution.final_answer}</b></p>
                {solution.common_mistake && <p style={{ background: "rgba(226,121,60,.12)", color: "#12181b", padding: 12, borderRadius: 10, fontSize: 14 }}>⚠️ Watch out: {solution.common_mistake}</p>}
              </>
            )}
          </div>
        )}
        {solution?.error && <div style={card}><p style={{ margin: 0 }}>❌ {solution.error}</p></div>}

        {/* ATTEMPT + MARKING */}
        <div style={card}>
          <div style={{ ...sectionLabel, marginBottom: 16 }}>Your attempt — get it marked</div>
          <textarea rows={4} style={ta} placeholder={"Show your working, e.g.\n(x−2)(x−3)=0\nx=2, x=3"} value={attempt} onChange={e => setAttempt(e.target.value)} />
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14, flexWrap: "wrap" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#5b6b6f", border: "1px solid rgba(23,59,76,.15)", padding: "9px 14px", borderRadius: 9, cursor: "pointer" }}>
              <span style={{ fontWeight: 600, color: "#173b4c" }}>Attach photo or PDF</span>
              <span>{attemptImage ? attemptImage.name : "no file selected"}</span>
              <input type="file" accept="image/*" onChange={onAttemptFile} style={{ display: "none" }} />
            </label>
            {attemptImage && (
              <button onClick={() => setAttemptImage(null)} style={{ background: "none", border: "none", color: "#c9622e", fontSize: 12.5, fontWeight: 600, cursor: "pointer", padding: 0 }}>
                Remove photo
              </button>
            )}
          </div>
          <a href="#" onClick={(e) => { e.preventDefault(); if (!(busy === "mark" || (!attempt && !attemptImage) || !question)) mark(); }}
            style={{ ...btn("#173b4c"), display: "inline-block", marginTop: 18, textDecoration: "none", opacity: (busy === "mark" || (!attempt && !attemptImage) || !question) ? 0.5 : 1, pointerEvents: (busy === "mark" || (!attempt && !attemptImage) || !question) ? "none" : "auto" }}>
            {busy === "mark" ? "Marking…" : "Mark my attempt"}
          </a>
        </div>

        {marking && !marking.error && (
          <div style={card}>
            <h3 style={{ fontFamily: "'Sora', sans-serif", margin: "0 0 4px", color: "#12181b" }}>Result: {marking.score} / {marking.out_of}</h3>

            {/* RED PEN — marks overlaid directly on the student's own photo, like a real examiner's margin */}
            {attemptImage && marking.awards?.some(a => a.step_index != null && marking.extracted?.steps?.[a.step_index]?.y != null) && (
              <div style={{ position: "relative", display: "inline-block", maxWidth: "100%", margin: "14px 0 20px", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(23,59,76,.1)" }}>
                <img
                  src={`data:${attemptImage.type};base64,${attemptImage.base64}`}
                  alt="Your marked attempt"
                  style={{ display: "block", width: "100%", maxWidth: 520, height: "auto" }}
                />
                {marking.awards.map((a, i) => {
                  const y = a.step_index != null ? marking.extracted?.steps?.[a.step_index]?.y : null;
                  if (y == null) return null;
                  const markColor = a.earned ? "#1f9d7c" : "#c81e3a";
                  return (
                    <div key={i} title={a.reason} style={{
                      position: "absolute", top: `${y}%`, right: 6, transform: "translateY(-50%)",
                      width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      background: "rgba(255,255,255,.88)", boxShadow: "0 1px 4px rgba(0,0,0,.25)",
                      color: markColor, fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 16,
                      border: `2px solid ${markColor}`, cursor: "default",
                    }}>
                      {a.earned ? "✓" : "✗"}
                    </div>
                  );
                })}
              </div>
            )}

            {marking.awards?.map((a, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", background: a.earned ? "rgba(31,157,124,.1)" : "rgba(226,121,60,.12)", padding: "10px 14px", borderRadius: 9, margin: "8px 0", fontSize: 14 }}>
                <span style={{ color: "#12181b" }}>{a.reason}</span>
                <b style={{ color: a.earned ? "#157a61" : "#c9622e", marginLeft: 12, whiteSpace: "nowrap" }}>{a.code} {a.earned ? "✓" : "✗"}</b>
              </div>
            ))}
            <p style={{ fontSize: 14.5, color: "#5b6b6f" }}>{marking.summary}</p>
            <a href="#" onClick={(e) => { e.preventDefault(); practice(); }} style={{ ...btn(), display: "inline-block", textDecoration: "none" }}>Next practice question →</a>
          </div>
        )}
        {marking?.needsSubscription ? (
          <div style={{ ...card, background: "#0f2740", color: "#fff", textAlign: "center", padding: 40 }}>
            <h3 style={{ fontFamily: "'Sora', sans-serif", margin: "0 0 8px" }}>Enjoying Solprove? Keep going with unlimited marking.</h3>
            <p style={{ color: "rgba(255,255,255,.7)", fontSize: 14.5, margin: "0 0 20px" }}>
              Unlimited questions, examiner-style marking and the weekly parent report.<br />
              <b style={{ color: "#fff" }}>£11.99/month · first 7 days free · cancel anytime</b>
            </p>
            <button style={btn()} onClick={subscribe}>Start free trial</button>
          </div>
        ) : marking?.error ? (
          <div style={card}><p style={{ margin: 0 }}>❌ {marking.error}</p></div>
        ) : null}
      </div>
    </div>
  );
}
