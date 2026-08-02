"use client";
import { useState } from "react";

// A small hand-written parser instead of eval() — safer, and easy to control exactly
// which operators/functions are supported. Trig runs in degrees by default (GCSE
// calculators default to degree mode), toggleable to radians.
function evaluateExpression(raw, degMode) {
  const s = raw.replace(/π/g, "pi").replace(/\s+/g, "");
  if (!s) throw new Error("empty");
  let pos = 0;
  const peek = () => s[pos];
  const consume = (c) => { if (s[pos] !== c) throw new Error("Syntax error"); pos++; };

  function parseNumber() {
    const start = pos;
    while (pos < s.length && /[0-9.]/.test(s[pos])) pos++;
    if (pos === start) throw new Error("Expected a number");
    return parseFloat(s.slice(start, pos));
  }
  function parseIdent() {
    const start = pos;
    while (pos < s.length && /[a-zA-Z]/.test(s[pos])) pos++;
    return s.slice(start, pos);
  }
  function parseFactor() {
    if (peek() === "(") { consume("("); const v = parseExpr(); consume(")"); return v; }
    if (peek() === "-") { consume("-"); return -parseFactor(); }
    if (peek() === "+") { consume("+"); return parseFactor(); }
    if (peek() && /[a-zA-Z]/.test(peek())) {
      const id = parseIdent();
      if (id === "pi") return Math.PI;
      if (id === "e") return Math.E;
      consume("(");
      const arg = parseExpr();
      consume(")");
      const angle = degMode ? (arg * Math.PI) / 180 : arg;
      switch (id) {
        case "sin": return Math.sin(angle);
        case "cos": return Math.cos(angle);
        case "tan": return Math.tan(angle);
        case "sqrt": return Math.sqrt(arg);
        case "log": return Math.log10(arg);
        case "ln": return Math.log(arg);
        default: throw new Error(`Unknown function "${id}"`);
      }
    }
    return parseNumber();
  }
  function parsePower() {
    const base = parseFactor();
    if (peek() === "^") { consume("^"); const exp = parsePower(); return Math.pow(base, exp); }
    return base;
  }
  function parseTerm() {
    let v = parsePower();
    while (peek() === "*" || peek() === "/" || peek() === "%") {
      const op = peek(); consume(op);
      const rhs = parsePower();
      if (op === "*") v *= rhs;
      else if (op === "/") v /= rhs;
      else v = v % rhs;
    }
    return v;
  }
  function parseExpr() {
    let v = parseTerm();
    while (peek() === "+" || peek() === "-") {
      const op = peek(); consume(op);
      v = op === "+" ? v + parseTerm() : v - parseTerm();
    }
    return v;
  }

  const result = parseExpr();
  if (pos !== s.length) throw new Error("Syntax error");
  if (!isFinite(result)) throw new Error("Error");
  return Math.round(result * 1e10) / 1e10;
}

const KEY_ROWS = [
  ["sin(", "cos(", "tan(", "√("],
  ["7", "8", "9", "÷"],
  ["4", "5", "6", "×"],
  ["1", "2", "3", "−"],
  ["0", ".", "π", "+"],
  ["(", ")", "^", "="],
];
const DISPLAY_MAP = { "÷": "/", "×": "*", "−": "-", "√(": "sqrt(" };

export default function Calculator() {
  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState("");
  const [result, setResult] = useState(null);
  const [degMode, setDegMode] = useState(true);
  const [err, setErr] = useState(false);

  function press(label) {
    if (label === "=") {
      try {
        const val = evaluateExpression(display, degMode);
        setResult(val); setErr(false);
        setDisplay(String(val));
      } catch {
        setResult(null); setErr(true);
      }
      return;
    }
    const token = DISPLAY_MAP[label] || label;
    setErr(false);
    setDisplay((d) => {
      const last = d.slice(-1);
      const needsStar = /[0-9).]/.test(last) && /^[a-zA-Z(π]/.test(token);
      return d + (needsStar ? "*" : "") + token;
    });
  }

  function clearAll() { setDisplay(""); setResult(null); setErr(false); }
  function backspace() { setDisplay((d) => d.slice(0, -1)); setErr(false); }

  return (
    <div style={{ position: "fixed", left: 20, bottom: 20, zIndex: 9999, fontFamily: "'Inter', sans-serif" }}>
      {open && (
        <div style={{ width: 260, background: "#0f2740", borderRadius: 16, padding: 14, marginBottom: 12, boxShadow: "0 8px 28px rgba(0,0,0,.28)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ color: "rgba(255,255,255,.6)", fontSize: 11, fontWeight: 700, letterSpacing: ".04em" }}>CALCULATOR</span>
            <button onClick={() => setDegMode((v) => !v)} style={{ background: "rgba(255,255,255,.1)", border: "none", color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "3px 8px", cursor: "pointer" }}>
              {degMode ? "DEG" : "RAD"}
            </button>
          </div>

          <div style={{ background: "rgba(255,255,255,.06)", borderRadius: 10, padding: "12px 12px", marginBottom: 10, minHeight: 46 }}>
            <div style={{ color: "#fff", fontFamily: "monospace", fontSize: 16, wordBreak: "break-all", textAlign: "right" }}>
              {display || "0"}
            </div>
            {err && <div style={{ color: "#e2793c", fontSize: 11, textAlign: "right", marginTop: 2 }}>Can't calculate that</div>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 6 }}>
            <button onClick={clearAll} style={calcBtn("rgba(226,121,60,.18)", "#e2793c")}>AC</button>
            <button onClick={backspace} style={calcBtn("rgba(255,255,255,.1)", "#fff")}>⌫</button>
            <div />
            <div />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
            {KEY_ROWS.flat().map((k, i) => (
              <button key={i} onClick={() => press(k)} style={calcBtn(
                k === "=" ? "#1f9d7c" : /[0-9.]/.test(k) ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.06)",
                "#fff"
              )}>{k}</button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        title="Calculator"
        style={{
          width: 52, height: 52, borderRadius: "50%", border: "none", cursor: "pointer",
          background: "#173b4c", color: "#fff", fontSize: 22, boxShadow: "0 4px 14px rgba(0,0,0,.25)",
        }}
      >
        {open ? "✕" : "🖩"}
      </button>
    </div>
  );
}

function calcBtn(bg, color) {
  return {
    background: bg, color, border: "none", borderRadius: 8, padding: "10px 0",
    fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif",
  };
}
