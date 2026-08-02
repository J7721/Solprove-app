// The waitlist nurture sequence — sent manually (or via a simple script) to whoever's
// signed up through the #waitlist Formspree form, ahead of and at launch.
//
// Compliance note: these are marketing emails to people who opted in via the waitlist
// form, which covers UK PECR/GDPR consent. There's no automated unsubscribe list yet —
// each email below invites a reply to opt out, which is manageable at beta scale but
// should become a real one-click unsubscribe before sending to a larger list.

function shell(bodyHtml, preheader = "") {
  return `<!doctype html><html><body style="margin:0;background:#f4f3ef;font-family:Arial,Helvetica,sans-serif">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${preheader}</div>` : ""}
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:28px 12px">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
      <tr><td style="background:#0f2740;border-radius:14px 14px 0 0;padding:18px 24px">
        <span style="display:inline-block;background:#1f9d7c;color:#fff;font-weight:800;border-radius:8px;padding:3px 9px;font-size:15px">✓</span>
        <span style="color:#fff;font-weight:800;font-size:19px;padding-left:8px">Solprove</span>
      </td></tr>
      <tr><td style="background:#ffffff;border:1px solid #e9e7df;border-top:0;border-radius:0 0 14px 14px;padding:28px 26px">
        ${bodyHtml}
        <div style="font-size:12px;color:#8a93ad;padding-top:22px;border-top:1px solid #f0efe9;margin-top:22px">
          You're getting this because you joined the Solprove waitlist at solprove.co.uk. Don't want these updates? Just reply and let us know — we'll take you off the list.
        </div>
      </td></tr>
    </table>
  </td></tr></table></body></html>`;
}

const btn = (href, text) =>
  `<a href="${href}" style="display:inline-block;background:#1f9d7c;color:#ffffff;font-weight:700;font-size:15px;padding:13px 26px;border-radius:9px;text-decoration:none">${text}</a>`;

export const WAITLIST_SEQUENCE = [
  {
    id: "welcome",
    step: 1,
    label: "1. Welcome (send right after signup)",
    subject: "You're on the Solprove waitlist",
    html: shell(`
      <h1 style="font-family:Georgia,serif;font-size:22px;color:#12181b;margin:0 0 14px">You're in.</h1>
      <p style="font-size:15px;line-height:1.6;color:#3a4548;margin:0 0 14px">Thanks for joining the Solprove waitlist. We're building an AI GCSE Maths tutor that does something most homework apps don't bother with: it marks your child's <i>actual working</i>, the way a real examiner would — not just whether the final answer is right.</p>
      <p style="font-size:15px;line-height:1.6;color:#3a4548;margin:0 0 14px">Most lost marks aren't about not understanding the maths — they're method marks, sign errors, notation slips. That's exactly what Solprove is built to catch and explain.</p>
      <p style="font-size:15px;line-height:1.6;color:#3a4548;margin:0 0 0">We'll email you the moment it's live. In the meantime, no need to do anything — just sit tight.</p>
    `, "Thanks for joining — here's what to expect."),
  },
  {
    id: "pain-point",
    step: 2,
    label: "2. Why marks get lost (send ~day 3)",
    subject: "The real reason GCSE Maths marks get lost",
    html: shell(`
      <h1 style="font-family:Georgia,serif;font-size:22px;color:#12181b;margin:0 0 14px">It's rarely about not understanding the maths.</h1>
      <p style="font-size:15px;line-height:1.6;color:#3a4548;margin:0 0 14px">Talk to any GCSE Maths teacher and you'll hear the same thing: most students who "get" a topic still drop marks on it. A sign flipped halfway through. A method that was right but never fully written down. An answer that's correct but skips a required step.</p>
      <p style="font-size:15px;line-height:1.6;color:#3a4548;margin:0 0 14px">A right-or-wrong answer checker can't see any of that — it only looks at the final number. Solprove marks the working itself, step by step, against the same kind of mark scheme an examiner uses, and shows exactly which mark was lost and why.</p>
      <p style="font-size:15px;line-height:1.6;color:#3a4548;margin:0 0 0">We'll show you exactly what that looks like soon.</p>
    `, "It's rarely about not understanding the maths."),
  },
  {
    id: "feature",
    step: 3,
    label: "3. Feature preview (send ~day 7)",
    subject: "Exam practice that doesn't feel like homework",
    html: shell(`
      <h1 style="font-family:Georgia,serif;font-size:22px;color:#12181b;margin:0 0 14px">Two things we've been building</h1>
      <p style="font-size:15px;line-height:1.6;color:#3a4548;margin:0 0 14px"><b>Timed mock exams.</b> Original, exam-style questions under real time pressure, marked the same rigorous way — a proper dry run before the real thing, not just another worksheet.</p>
      <p style="font-size:15px;line-height:1.6;color:#3a4548;margin:0 0 14px"><b>Friends and streaks.</b> Studying alone is hard to stick with. Students can add people they already know, see each other's study streaks, and keep each other going — with safety-first settings for younger students (friends by invite code only, never open search).</p>
      <p style="font-size:15px;line-height:1.6;color:#3a4548;margin:0 0 0">Both are part of what's launching soon.</p>
    `, "Mock exams and study streaks, coming at launch."),
  },
  {
    id: "launch",
    step: 4,
    label: "4. Launch day (send once, when you flip LAUNCHED live)",
    subject: "Solprove is live — start free today",
    html: shell(`
      <h1 style="font-family:Georgia,serif;font-size:22px;color:#12181b;margin:0 0 14px">We're live.</h1>
      <p style="font-size:15px;line-height:1.6;color:#3a4548;margin:0 0 14px">Solprove is open — no more waitlist. Your child can start right now: 5 questions marked free every day, full worked solutions, and progress tracking. No card required.</p>
      <p style="font-size:15px;line-height:1.6;color:#3a4548;margin:0 0 22px">Want more? Premium unlocks unlimited marking, mock exams, and a weekly report straight to your inbox — first 7 days free.</p>
      <div>${btn("https://solprove.co.uk/app", "Start free — no card needed")}</div>
    `, "No more waitlist — Solprove is open."),
  },
];

export function getSequenceStep(step) {
  return WAITLIST_SEQUENCE.find((s) => s.step === Number(step));
}
