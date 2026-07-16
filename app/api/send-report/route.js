import { getUserFromRequest } from "../../../lib/auth";
import { getReportData, renderReportEmail } from "../../../lib/report";
import { sendEmail, emailEnabled } from "../../../lib/email";

// "Send me this week's report now" — used from the Parent view (and for testing 3C).
export async function POST(req) {
  try {
    if (!emailEnabled()) {
      return Response.json({ error: "Email isn't configured yet (RESEND_API_KEY missing)." }, { status: 400 });
    }
    const user = await getUserFromRequest(req);
    if (!user) return Response.json({ error: "Please sign in first." }, { status: 401 });

    const data = await getReportData(user.id);
    await sendEmail({
      to: user.email,
      subject: `Solprove weekly report — ${data.sessions} questions this week`,
      html: renderReportEmail(data),
    });
    return Response.json({ ok: true, sentTo: user.email });
  } catch (e) {
    console.error(e);
    return Response.json({ error: e.message || "Sending failed." }, { status: 500 });
  }
}
