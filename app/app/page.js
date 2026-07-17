"use client";
import { useEffect, useState } from "react";
import { getToken } from "../../lib/supabaseBrowser";

async function authHeaders() {
  const t = await getToken();
  return { "Content-Type": "application/json", ...(t ? { Authorization: `Bearer ${t}` } : {}) };
}

const card = { background: "#fff", border: "1px solid #e6e9f2", borderRadius: 14, padding: 20, marginBottom: 16 };
const btn = (bg = "#18b57a") => ({ background: bg, color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontWeight: 700, fontSize: 15, cursor: "pointer" });
const ta = { width: "100%", minHeight: 90, borderRadius: 10, border: "1px solid #cfd6e6", padding: 12, fontSize: 15, fontFamily: "inherit", boxSizing: "border-box" };
const chip = (bg, color) => ({ background: bg, color, padding: "2px 10px", borderRadius: 99, fontSize: 12, fontWeight: 700 });

export default function Home() {
  const [question, setQuestion] = useState("");
  const [questionId, setQuestionId] = useState(null); // set when question came from the bank
  const [attempt, setAttempt] = useState("");
  const [tier, setTier] = useState("foundation");
  const [image, setImage] = useState(null);
  const [solution, setSolution] = useState(null);
  const [marking, setMarking] = useState(null);
  const [progress, setProgress] = useState(null);
  const [busy, setBusy] = useState("");

  async function refreshProgress() {
    const res = await fetch("/api/practice", { method: "POST", headers: await authHeaders(), body: JSON.stringify({ tier }) });
    setProgress(await res.json());
  }
  useEffect(() => { refreshProgress(); }, []);

  async function onFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const b64 = await new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result.split(",")[1]); r.readAsDataURL(f); });
    setImage({ base64: b64, type: f.type, name: f.name });
    setQuestionId(null);
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
      body: JSON.stringify({ question: q, attempt, tier, questionId }) });
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
    setBusy("practice"); setSolution(null); setMarking(null); setAttempt(""); setImage(null);
    const res = await fetch("/api/practice", { method: "POST", headers: await authHeaders(), body: JSON.stringify({ tier }) });
    const data = await res.json();
    setProgress(data);
    if (data.question) { setQuestion(data.question.question); setQuestionId(data.question.id); }
    setBusy("");
  }

  return (
    <div>
      <h1 style={{ fontSize: 26, margin: "18px 0 6px" }}>Stuck on a question?</h1>
      <p style={{ color: "#5a6482", marginTop: 0 }}>Type it, photo it, or practise your weak spots. Marked like an examiner, every time.</p>

      {/* PROGRESS */}
      {progress?.progress?.length > 0 && (
        <div style={card}>
          <b style={{ fontSize: 14 }}>Your progress</b>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
            {progress.progress.map(t => (
              <span key={t.ref} style={chip(t.accuracy < 0.7 ? "#fff4e3" : "#eafaf2", t.accuracy < 0.7 ? "#c77700" : "#0e9c67")}>
                {t.ref} {t.title}: {Math.round(t.accuracy * 100)}% ({t.attempts} tries)
              </span>
            ))}
          </div>
          {progress.weakTopics?.length > 0 && (
            <p style={{ fontSize: 13.5, color: "#c77700", margin: "10px 0 0" }}>
              🎯 Focus areas: {progress.weakTopics.map(t => t.title).join(", ")}
            </p>
          )}
        </div>
      )}

      {/* QUESTION INPUT */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <label style={{ fontWeight: 700, fontSize: 14 }}>The question {questionId && <span style={chip("#e8ecff", "#3b4a8f")}>from your practice bank · {question && progress?.question?.marks ? `${progress.question.marks} marks` : "bank"}</span>}</label>
          <button style={btn("#5b6ee1")} onClick={practice} disabled={busy === "practice"}>
            {busy === "practice" ? "Picking…" : "🎯 Practice my weak spots"}
          </button>
        </div>
        <textarea style={{ ...ta, marginTop: 8 }} placeholder="e.g. Solve x² − 5x + 6 = 0" value={question}
          onChange={e => { setQuestion(e.target.value); setQuestionId(null); }} />
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 10, flexWrap: "wrap" }}>
          <input type="file" accept="image/*" onChange={onFile} />
          {image && <span style={{ fontSize: 13, color: "#0e9c67" }}>📷 {image.name}</span>}
          <select value={tier} onChange={e => setTier(e.target.value)} style={{ padding: 8, borderRadius: 8 }}>
            <option value="foundation">Foundation tier</option>
            <option value="higher">Higher tier</option>
          </select>
          <button style={btn()} onClick={solve} disabled={busy === "solve" || (!question && !image)}>
            {busy === "solve" ? "Thinking…" : "Explain step-by-step"}
          </button>
        </div>
      </div>

      {/* SOLUTION */}
      {solution && !solution.error && (
        <div style={card}>
          {solution.readable === false ? (
            <p>😅 I couldn't read that clearly — try a sharper photo or type the question.</p>
          ) : (
            <>
              <p style={{ fontSize: 13, color: "#5a6482" }}>I understood: <b>{solution.question_understood}</b> <span style={{ ...chip("#eafaf2", "#0e9c67"), marginLeft: 6 }}>AQA {solution.spec_ref}</span></p>
              {solution.steps?.map((s, i) => (
                <div key={i} style={{ borderLeft: "3px solid #18b57a", padding: "6px 12px", margin: "8px 0" }}>
                  <div style={{ fontSize: 13.5, color: "#5a6482" }}>{s.explain}</div>
                  <div style={{ fontWeight: 700, fontFamily: "monospace", fontSize: 15 }}>{s.working}</div>
                </div>
              ))}
              <p><b>Answer: {solution.final_answer}</b></p>
              {solution.common_mistake && <p style={{ background: "#fff4e3", padding: 10, borderRadius: 8, fontSize: 14 }}>⚠️ Watch out: {solution.common_mistake}</p>}
            </>
          )}
        </div>
      )}
      {solution?.error && <div style={card}><p>❌ {solution.error}</p></div>}

      {/* ATTEMPT + MARKING */}
      <div style={card}>
        <label style={{ fontWeight: 700, fontSize: 14 }}>Your attempt — get it marked</label>
        <textarea style={{ ...ta, marginTop: 8 }} placeholder={"Show your working, e.g.\n(x−2)(x−3)=0\nx=2, x=3"} value={attempt} onChange={e => setAttempt(e.target.value)} />
        <button style={{ ...btn("#0f1b3d"), marginTop: 10 }} onClick={mark} disabled={busy === "mark" || !attempt || !question}>
          {busy === "mark" ? "Marking…" : "Mark my attempt"}
        </button>
      </div>

      {marking && !marking.error && (
        <div style={card}>
          <h3 style={{ margin: "0 0 4px" }}>Result: {marking.score} / {marking.out_of}</h3>
          {marking.awards?.map((a, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", background: a.earned ? "#eafaf2" : "#fff4e3", padding: "8px 12px", borderRadius: 8, margin: "6px 0", fontSize: 14 }}>
              <span>{a.reason}</span>
              <b style={{ color: a.earned ? "#0e9c67" : "#c77700", marginLeft: 12, whiteSpace: "nowrap" }}>{a.code} {a.earned ? "✓" : "✗"}</b>
            </div>
          ))}
          <p style={{ fontSize: 14.5 }}>{marking.summary}</p>
          <button style={btn("#5b6ee1")} onClick={practice}>Next practice question →</button>
        </div>
      )}
      {marking?.needsSubscription ? (
        <div style={{ ...card, background: "#0f1b3d", color: "#fff", textAlign: "center", padding: 32 }}>
          <h3 style={{ margin: "0 0 6px" }}>Enjoying Solprove? Keep going with unlimited marking.</h3>
          <p style={{ color: "#c6cdE6", fontSize: 14.5, margin: "0 0 18px" }}>
            Unlimited questions, examiner-style marking and the weekly parent report.<br />
            <b style={{ color: "#fff" }}>£11.99/month · first 7 days free · cancel anytime</b>
          </p>
          <button style={btn()} onClick={subscribe}>Start free trial</button>
        </div>
      ) : marking?.error ? (
        <div style={card}><p>❌ {marking.error}</p></div>
      ) : null}
    </div>
  );
}
