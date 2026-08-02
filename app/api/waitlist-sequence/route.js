// Sends one step of the waitlist nurture sequence to a pasted list of emails.
// Protected by ADMIN_SECRET (same pattern as CRON_SECRET) — set this in .env.local
// and in Vercel's env vars before using the /admin/waitlist page.
import { sendEmail, emailEnabled } from "../../../lib/email";
import { getSequenceStep, WAITLIST_SEQUENCE } from "../../../lib/waitlistSequence";

// GET — just the copy, for the admin preview page. Not secret; only sending is gated.
export async function GET() {
  return Response.json({ steps: WAITLIST_SEQUENCE.map(({ step, label, subject, html }) => ({ step, label, subject, html })) });
}

export async function POST(req) {
  try {
    const { secret, step, emails } = await req.json();

    if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
      return Response.json({ error: "Not authorised." }, { status: 401 });
    }
    if (!emailEnabled()) {
      return Response.json({ error: "Email isn't configured yet (RESEND_API_KEY missing)." }, { status: 400 });
    }
    const template = getSequenceStep(step);
    if (!template) return Response.json({ error: "Unknown sequence step." }, { status: 400 });

    const list = (Array.isArray(emails) ? emails : String(emails || "").split(/[\n,]/))
      .map((e) => e.trim())
      .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

    if (!list.length) return Response.json({ error: "No valid email addresses given." }, { status: 400 });

    let sent = 0;
    const failed = [];
    for (const to of list) {
      try {
        await sendEmail({ to, subject: template.subject, html: template.html });
        sent += 1;
      } catch (e) {
        failed.push({ to, error: e.message });
      }
      // Light pacing so we don't slam Resend's rate limit on a big list.
      await new Promise((r) => setTimeout(r, 250));
    }

    return Response.json({ ok: true, sent, failed, total: list.length });
  } catch (e) {
    console.error(e);
    return Response.json({ error: e.message || "Sending failed." }, { status: 500 });
  }
}
