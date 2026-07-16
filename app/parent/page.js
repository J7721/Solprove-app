"use client";
import { useEffect, useState } from "react";
import { getToken } from "../../lib/supabaseBrowser";

const card = { background: "#fff", border: "1px solid #e6e9f2", borderRadius: 14, padding: 20, marginBottom: 16 };
const big = { fontSize: 30, fontWeight: 800, margin: 0 };

export default function ParentView() {
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const t = await getToken();
      const res = await fetch("/api/parent", { headers: t ? { Authorization: `Bearer ${t}` } : {} });
      setData(await res.json());
    })();
  }, []);

  if (!data) return <p style={{ padding: 20 }}>Loading…</p>;

  const pct = v => (v == null ? "—" : Math.round(v * 100) + "%");

  return (
    <div>
      <h1 style={{ fontSize: 26, margin: "18px 0 6px" }}>Parent view</h1>
      {!data.signedIn && (
        <div style={{ ...card, background: "#fff8ec", borderColor: "#ffdfa3" }}>
          <b>You're not signed in.</b>
          <p style={{ margin: "6px 0 10px", fontSize: 14 }}>Sign in to keep your family's progress private and saved to your account.</p>
          <a href="/login" style={{ background: "#18b57a", color: "#fff", padding: "10px 16px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>Parent sign in →</a>
        </div>
      )}
      {data.signedIn && (
        <p style={{ fontSize: 13, color: "#0e9c67", display: "flex", alignItems: "center", gap: 12 }}>
          Signed in as {data.email}
          <button
            onClick={async () => {
              const t = await getToken();
              const res = await fetch("/api/send-report", { method: "POST", headers: t ? { Authorization: `Bearer ${t}` } : {} });
              const r = await res.json();
              alert(r.ok ? `Report emailed to ${r.sentTo} 📬` : r.error);
            }}
            style={{ background: "#5b6ee1", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
          >
            📬 Email me this week's report
          </button>
        </p>
      )}
      <p style={{ color: "#5a6482", marginTop: 0 }}>
        What your child practised and how it's going. Questions and chats stay private — you see topics and progress, exactly like the weekly email will show.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={card}>
          <p style={{ margin: 0, fontSize: 13, color: "#5a6482" }}>Questions attempted this week</p>
          <p style={big}>{data.week.sessions}</p>
        </div>
        <div style={card}>
          <p style={{ margin: 0, fontSize: 13, color: "#5a6482" }}>Accuracy this week</p>
          <p style={big}>{pct(data.week.accuracy)}</p>
        </div>
      </div>

      {data.focus.length > 0 && (
        <div style={{ ...card, background: "#fff8ec", borderColor: "#ffdfa3" }}>
          <b>Suggested focus this week</b>
          <p style={{ margin: "6px 0 0", fontSize: 14.5 }}>
            {data.focus.map(f => `${f.title} (currently ${pct(f.accuracy)})`).join(" · ")}
          </p>
        </div>
      )}

      <div style={card}>
        <b>Progress by topic</b>
        {data.topics.length === 0 && <p style={{ color: "#5a6482", fontSize: 14 }}>No practice yet this week.</p>}
        {data.topics.map(t => (
          <div key={t.ref} style={{ margin: "10px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
              <span>{t.ref} · {t.title}</span>
              <b style={{ color: t.accuracy < 0.7 ? "#c77700" : "#0e9c67" }}>{pct(t.accuracy)} · {t.attempts} tries</b>
            </div>
            <div style={{ background: "#eef1f8", borderRadius: 99, height: 8, marginTop: 4 }}>
              <div style={{ width: `${Math.max(4, t.accuracy * 100)}%`, background: t.accuracy < 0.7 ? "#ffb648" : "#18b57a", height: 8, borderRadius: 99 }} />
            </div>
          </div>
        ))}
      </div>

      <div style={card}>
        <b>Recent activity</b>
        {data.recent.map((a, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "7px 0", borderBottom: "1px solid #f0f2f8" }}>
            <span style={{ color: "#5a6482", maxWidth: "70%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {new Date(a.ts).toLocaleDateString("en-GB")} · {a.topic} — {a.question}
            </span>
            <b>{a.score}/{a.outOf}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
