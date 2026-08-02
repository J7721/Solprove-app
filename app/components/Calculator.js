"use client";
import { useState } from "react";

// A small hand-written parser instead of eval() — safer, and easy to control exactly
// which operators/functions are supported. Trig runs in degrees by default (GCSE
// calculators default to degree mode), toggleable to radians. Verified in isolation
// against a battery of test expressions (inverse trig, Ans, standard-form entry,
// nested parens, division-by-zero, syntax errors) before wiring up to the UI.
function evaluateExpression(raw, degMode, ansValue) {
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
      if (id === "Ans") return ansValue == null ? 0 : ansValue;
      consume("(");
      const arg = parseExpr();
      consume(")");
      const angle = degMode ? (arg * Math.PI) / 180 : arg;
      switch (id) {
        case "sin": return Math.sin(angle);
        case "cos": return Math.cos(angle);
        case "tan": return Math.tan(angle);
        case "asin": { const r = Math.asin(arg); return degMode ? (r * 180) / Math.PI : r; }
        case "acos": { const r = Math.acos(arg); return degMode ? (r * 180) / Math.PI : r; }
        case "atan": { const r = Math.atan(arg); return degMode ? (r * 180) / Math.PI : r; }
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

function KEY(label, opts = {}) {
  return {
    label,
    token: opts.token ?? label,
    shiftLabel: opts.shiftLabel ?? null,
    shiftToken: opts.shiftToken ?? null,
    action: opts.action ?? null,
  };
}

const ROWS = [
  [KEY("SHIFT", { action: "shift" }), KEY("DRG", { action: "drg" }), KEY("DEL", { action: "del" }), KEY("AC", { action: "ac" })],
  [KEY("x⁻¹", { token: "^(-1)" }), KEY("√", { token: "sqrt(" }), KEY("x²", { token: "^2" }), KEY("^")],
  [
    KEY("sin", { token: "sin(", shiftLabel: "sin⁻¹", shiftToken: "asin(" }),
    KEY("cos", { token: "cos(", shiftLabel: "cos⁻¹", shiftToken: "acos(" }),
    KEY("tan", { token: "tan(", shiftLabel: "tan⁻¹", shiftToken: "atan(" }),
    KEY("log", { token: "log(", shiftLabel: "10ˣ", shiftToken: "10^(" }),
  ],
  [KEY("("), KEY(")"), KEY("π"), KEY("ln", { token: "ln(", shiftLabel: "eˣ", shiftToken: "e^(" })],
  [KEY("7"), KEY("8"), KEY("9"), KEY("÷", { token: "/" })],
  [KEY("4"), KEY("5"), KEY("6"), KEY("×", { token: "*" })],
  [KEY("1"), KEY("2"), KEY("3"), KEY("−", { token: "-" })],
  [KEY("0"), KEY("."), KEY("Ans"), KEY("+")],
  [KEY("M+", { action: "m+" }), KEY("MR", { action: "mr", shiftLabel: "MC" }), KEY("EXP", { token: "*10^" }), KEY("=", { action: "eq" })],
];

export default function Calculator() {
  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState("");
  const [result, setResult] = useState(null);
  const [degMode, setDegMode] = useState(true);
  const [shiftOn, setShiftOn] = useState(false);
  const [memory, setMemory] = useState(0);
  const [lastAnswer, setLastAnswer] = useState(null);
  const [err, setErr] = useState(false);

  function appendToken(token) {
    setErr(false);
    setDisplay((d) => {
      const last = d.slice(-1);
      const needsStar = /[0-9).]/.test(last) && /^[a-zA-Z(π]/.test(token);
      return d + (needsStar ? "*" : "") + token;
    });
  }

  function evalNow() {
    const val = evaluateExpression(display, degMode, lastAnswer);
    setResult(val); setLastAnswer(val); setDisplay(String(val)); setErr(false);
    return val;
  }

  function press(key) {
    const shifted = shiftOn;
    if (key.action !== "shift") setShiftOn(false);

    if (key.action === "shift") { setShiftOn((v) => !v); return; }
    if (key.action === "drg") { setDegMode((v) => !v); return; }
    if (key.action === "del") { setDisplay((d) => d.slice(0, -1)); setErr(false); return; }
    if (key.action === "ac") { setDisplay(""); setResult(null); setErr(false); return; }
    if (key.action === "eq") { try { evalNow(); } catch { setResult(null); setErr(true); } return; }
    if (key.action === "m+") { try { const v = evalNow(); setMemory((m) => m + v); } catch { setErr(true); } return; }
    if (key.action === "mr") {
      if (shifted) { setMemory(0); return; }
      appendToken(String(memory));
      return;
    }
    appendToken(shifted && key.shiftToken ? key.shiftToken : key.token);
  }

  return (
    <div style={{ position: "fixed", left: 20, bottom: 20, zIndex: 9999, fontFamily: "'Inter', sans-serif" }}>
      {open && (
        <div style={{ width: 272, background: "#1b2a3d", borderRadius: 18, padding: "16px 14px", marginBottom: 12, boxShadow: "0 10px 32px rgba(0,0,0,.32)", border: "1px solid rgba(255,255,255,.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, padding: "0 2px" }}>
            <span style={{ color: "rgba(255,255,255,.55)", fontSize: 10.5, fontWeight: 700, letterSpacing: ".06em" }}>SCIENTIFIC CALCULATOR</span>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,.5)", fontSize: 14, cursor: "pointer" }}>✕</button>
          </div>

          {/* Screen */}
          <div style={{ background: "#c9d6b8", borderRadius: 8, padding: "10px 12px", marginBottom: 12, boxShadow: "inset 0 2px 6px rgba(0,0,0,.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 700, color: "#4a5540", marginBottom: 4 }}>
              <span>{degMode ? "DEG" : "RAD"}</span>
              <div style={{ display: "flex", gap: 8 }}>
                {shiftOn && <span>SHIFT</span>}
                {memory !== 0 && <span>M</span>}
              </div>
            </div>
            <div style={{ color: "#232b1c", fontFamily: "monospace", fontSize: 15, wordBreak: "break-all", textAlign: "right", minHeight: 20 }}>
              {display || "0"}
            </div>
            <div style={{ color: "#4a5540", fontFamily: "monospace", fontSize: 12, textAlign: "right", minHeight: 16 }}>
              {err ? "Can't calculate that" : result != null ? `= ${result}` : " "}
            </div>
          </div>

          {/* Keys */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {ROWS.map((row, ri) => (
              <div key={ri} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {row.map((key, ci) => {
                  const isDigit = /^[0-9.]$/.test(key.label);
                  const isEquals = key.action === "eq";
                  const isShiftKey = key.action === "shift";
                  const isClear = key.action === "ac" || key.action === "del";
                  const bg = isEquals
                    ? "#1f9d7c"
                    : isShiftKey
                    ? (shiftOn ? "#e2793c" : "rgba(255,255,255,.1)")
                    : isClear
                    ? "rgba(226,121,60,.22)"
                    : isDigit
                    ? "rgba(255,255,255,.14)"
                    : "rgba(255,255,255,.06)";
                  return (
                    <button
                      key={ci}
                      onClick={() => press(key)}
                      style={{
                        position: "relative", background: bg, color: "#fff", border: "none", borderRadius: 8,
                        padding: key.shiftLabel ? "12px 0 6px" : "10px 0", fontSize: 13, fontWeight: 600, cursor: "pointer",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {key.shiftLabel && (
                        <span style={{ position: "absolute", top: 1, left: 0, right: 0, fontSize: 8.5, color: "#e2793c", fontWeight: 700 }}>
                          {key.shiftLabel}
                        </span>
                      )}
                      {key.label}
                    </button>
                  );
                })}
              </div>
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
