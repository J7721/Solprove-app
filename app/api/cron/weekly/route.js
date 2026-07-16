import { createClient } from "@supabase/supabase-js";
import { getReportData, renderReportEmail } from "../../../../lib/report";
import { sendEmail, emailEnabled } from "../../../../lib/email";

// Weekly report blast — called automatically every Sunday 17:00 once deployed (see vercel.json).
// Protected: requires the CRON_SECRET so strangers can't trigger it.
export async function GET(req) {
  const auth = req.headers.get("authorization") || "";
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!emailEnabled()) return Response.json({ error: "Email not configured" }, { status: 400 });

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) return Response.json({ error: error.message }, { status: 500 });

  let sent = 0, skipped = 0, failed = 0;
  for (const user of data.users) {
    try {
      const report = await getReportData(user.id);
      if (report.sessions === 0 && report.topics.length === 0) { skipped++; continue; } // never-active accounts
      await sendEmail({
        to: user.email,
        subject: `Solprove weekly report — ${report.sessions} questions this week`,
        html: renderReportEmail(report),
      });
      sent++;
    } catch (e) {
      console.error(`Report failed for ${user.email}:`, e.message);
      failed++;
    }
  }
  return Response.json({ ok: true, sent, skipped, failed });
}
