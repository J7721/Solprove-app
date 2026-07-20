import Anthropic from "@anthropic-ai/sdk";
import { INBOUND_EMAIL_SYSTEM } from "../../../lib/prompts";
import { sendEmail, getReceivedEmail } from "../../../lib/email";
import { verifyResendWebhook } from "../../../lib/verifyResendWebhook";

export const runtime = "nodejs";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const OWNER_EMAIL = process.env.OWNER_EMAIL || "jayleon820@gmail.com";
const NOREPLY_PATTERN = /(no-?reply|do-?not-?reply|mailer-daemon|postmaster)/i;

export async function POST(req) {
  const rawBody = await req.text();

  const verified = verifyResendWebhook({
    payload: rawBody,
    headers: {
      "svix-id": req.headers.get("svix-id"),
      "svix-timestamp": req.headers.get("svix-timestamp"),
      "svix-signature": req.headers.get("svix-signature"),
    },
    secret: process.env.RESEND_WEBHOOK_SECRET,
  });
  if (!verified) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Bad payload" }, { status: 400 });
  }

  if (event.type !== "email.received") {
    return Response.json({ ok: true });
  }

  try {
    await handleInboundEmail(event.data);
  } catch (err) {
    console.error("email-inbound processing error", err);
    try {
      await sendEmail({
        to: OWNER_EMAIL,
        subject: "Solprove: an inbound email failed to auto-process",
        html: `<p>An email came in but the AI triage pipeline hit an error — check the Receiving tab in your Resend dashboard so nothing gets missed.</p><p style="color:#888;font-size:12px">${escapeHtml(String(err).slice(0, 500))}</p>`,
      });
    } catch (notifyErr) {
      console.error("email-inbound: also failed to notify owner", notifyErr);
    }
  }

  return Response.json({ ok: true });
}

async function handleInboundEmail(data) {
  const { email_id, message_id, from, subject, to } = data || {};
  if (!email_id) return;

  const senderAddress = extractAddress(from);
  // Guard against loops: never auto-process mail from ourselves or obvious automated senders.
  if (!senderAddress || NOREPLY_PATTERN.test(senderAddress) || senderAddress.toLowerCase() === OWNER_EMAIL.toLowerCase()) {
    return;
  }

  const full = await getReceivedEmail(email_id);
  const bodyText = (full.text || stripHtml(full.html) || "(no readable body)").slice(0, 4000);

  const msg = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 700,
    temperature: 0.3,
    system: INBOUND_EMAIL_SYSTEM,
    messages: [
      {
        role: "user",
        content: `From: ${from}\nTo: ${(to || []).join(", ")}\nSubject: ${subject || "(no subject)"}\n\nBody:\n${bodyText}`,
      },
    ],
  });
  const text = msg.content.find(b => b.type === "text")?.text || "";
  let result;
  try {
    result = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
  } catch {
    result = null;
  }

  // If the model didn't return usable JSON, don't guess — escalate to the owner as-is.
  if (!result || !result.reply_text) {
    await sendEmail({
      to: OWNER_EMAIL,
      subject: `Needs your reply: ${subject || "(no subject)"}`,
      html: `<p><strong>From:</strong> ${escapeHtml(from)}</p><p>The AI couldn't confidently draft a reply for this one.</p><hr/>${textToHtml(bodyText)}`,
    });
    return;
  }

  const replySubject = result.reply_subject || `Re: ${subject || "your message"}`;

  if (result.category === "faq") {
    await sendEmail({
      to: senderAddress,
      subject: replySubject,
      html: textToHtml(result.reply_text),
      headers: message_id ? { "In-Reply-To": message_id } : undefined,
    });
    await sendEmail({
      to: OWNER_EMAIL,
      subject: `Auto-replied: ${subject || "(no subject)"}`,
      html: `
        <p><strong>From:</strong> ${escapeHtml(from)}</p>
        <p><strong>Why auto-replied:</strong> ${escapeHtml(result.note_to_owner || "")}</p>
        <hr/>
        <p><strong>Sent:</strong></p>
        ${textToHtml(result.reply_text)}
        <hr/>
        <p><strong>Original message:</strong></p>
        ${textToHtml(bodyText)}
      `,
    });
  } else {
    const mailtoHref = `mailto:${encodeURIComponent(senderAddress)}?subject=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(result.reply_text)}`;
    await sendEmail({
      to: OWNER_EMAIL,
      subject: `Needs your reply: ${subject || "(no subject)"}`,
      html: `
        <p><strong>From:</strong> ${escapeHtml(from)}</p>
        <p><strong>Why it needs you:</strong> ${escapeHtml(result.note_to_owner || "")}</p>
        <hr/>
        <p><strong>Original message:</strong></p>
        ${textToHtml(bodyText)}
        <hr/>
        <p><strong>AI's suggested reply:</strong></p>
        ${textToHtml(result.reply_text)}
        <p><a href="${mailtoHref}">Open a reply with this draft pre-filled →</a></p>
      `,
    });
  }
}

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function textToHtml(text) {
  return String(text || "")
    .split(/\n{2,}/)
    .map(p => `<p>${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`)
    .join("");
}
function escapeHtml(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function extractAddress(fromHeader) {
  const m = String(fromHeader || "").match(/<([^>]+)>/);
  return (m ? m[1] : fromHeader || "").trim();
}
