// Weekly parent report: one data builder, used by the Parent view, the email, and the cron job.
import fs from "fs";
import path from "path";
import { topicStats, weakTopics, allAttempts } from "./store.js";

const specPilot = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "data", "spec-pilot.json"), "utf8")
);
const refTitles = {};
for (const c of specPilot.clusters) for (const r of c.refs) refTitles[r.ref] = r.title;

export async function getReportData(userId) {
  const [stats, weak, attempts] = await Promise.all([
    topicStats(userId), weakTopics(userId), allAttempts(userId),
  ]);
  const last7 = attempts.filter(a => Date.now() - new Date(a.ts).getTime() < 7 * 86400e3);
  const earned = last7.reduce((s, a) => s + a.score, 0);
  const avail = last7.reduce((s, a) => s + a.outOf, 0);
  return {
    sessions: last7.length,
    accuracy: avail ? earned / avail : null,
    topics: stats.map(t => ({ ...t, title: refTitles[t.ref] || t.ref })),
    focus: weak.slice(0, 2).map(t => ({ ...t, title: refTitles[t.ref] || t.ref })),
  };
}

const pct = v => (v == null ? "—" : Math.round(v * 100) + "%");

export function renderReportEmail(data) {
  const focusLine = data.focus.length
    ? `<tr><td style="background:#fff8ec;border:1px solid #ffdfa3;border-radius:10px;padding:14px 18px;font-size:14px">
         🎯 <b>Suggested focus this week:</b> ${data.focus.map(f => `${f.title} (${pct(f.accuracy)})`).join(" · ")}
       </td></tr><tr><td height="14"></td></tr>`
    : "";

  const topicRows = data.topics.map(t => `
    <tr>
      <td style="padding:7px 0;font-size:14px;color:#1c2340">${t.ref} · ${t.title}</td>
      <td align="right" style="padding:7px 0;font-size:14px;font-weight:700;color:${t.accuracy < 0.7 ? "#c77700" : "#0e9c67"}">${pct(t.accuracy)} · ${t.attempts} tries</td>
    </tr>`).join("");

  return `<!doctype html><html><body style="margin:0;background:#f7f8fc;font-family:Arial,Helvetica,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:28px 12px">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
      <tr><td style="background:#0f1b3d;border-radius:14px 14px 0 0;padding:18px 24px">
        <span style="display:inline-block;background:#18b57a;color:#fff;font-weight:800;border-radius:8px;padding:3px 9px;font-size:15px">✓</span>
        <span style="color:#fff;font-weight:800;font-size:19px;padding-left:8px">Solprove</span>
        <span style="color:#8e9bc4;font-size:12px;padding-left:8px">Weekly progress report</span>
      </td></tr>
      <tr><td style="background:#ffffff;border:1px solid #e6e9f2;border-top:0;border-radius:0 0 14px 14px;padding:24px">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="50%" style="background:#f7f8fc;border-radius:10px;padding:14px 18px">
              <div style="font-size:12px;color:#5a6482">Questions this week</div>
              <div style="font-size:28px;font-weight:800;color:#1c2340">${data.sessions}</div>
            </td>
            <td width="12"></td>
            <td width="50%" style="background:#f7f8fc;border-radius:10px;padding:14px 18px">
              <div style="font-size:12px;color:#5a6482">Accuracy this week</div>
              <div style="font-size:28px;font-weight:800;color:#1c2340">${pct(data.accuracy)}</div>
            </td>
          </tr>
          <tr><td height="14" colspan="3"></td></tr>
        </table>
        ${focusLine}
        <div style="font-weight:700;font-size:15px;color:#1c2340;padding:4px 0 6px">Progress by topic</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #f0f2f8">
          ${topicRows || `<tr><td style="padding:10px 0;font-size:14px;color:#5a6482">No practice recorded this week — a gentle nudge might help!</td></tr>`}
        </table>
        <div style="font-size:12px;color:#8a93ad;padding-top:18px">
          You're receiving this because you have a Solprove family account. Questions and chats stay private — this report shows topics and progress only.
        </div>
      </td></tr>
    </table>
  </td></tr></table></body></html>`;
}
