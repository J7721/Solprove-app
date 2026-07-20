// Resend signs webhooks using the Svix scheme (svix-id / svix-timestamp / svix-signature
// headers, HMAC-SHA256 over "id.timestamp.body", secret shaped "whsec_<base64>").
// Verified manually here (no extra dependency) — same lean-lib approach as lib/email.js.
import crypto from "crypto";

export function verifyResendWebhook({ payload, headers, secret }) {
  const id = headers["svix-id"];
  const timestamp = headers["svix-timestamp"];
  const signature = headers["svix-signature"];
  if (!id || !timestamp || !signature || !secret || !payload) return false;

  // Reject old timestamps (>5 min) to limit replay-attack window.
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300) return false;

  let secretBytes;
  try {
    secretBytes = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  } catch {
    return false;
  }

  const signedContent = `${id}.${timestamp}.${payload}`;
  const expected = crypto.createHmac("sha256", secretBytes).update(signedContent).digest("base64");
  const expectedBuf = Buffer.from(expected, "base64");

  // svix-signature can list multiple space-separated "v1,<base64sig>" values (key rotation).
  const candidates = signature
    .split(" ")
    .map(s => s.split(",")[1])
    .filter(Boolean);

  return candidates.some(sig => {
    try {
      const sigBuf = Buffer.from(sig, "base64");
      return sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf);
    } catch {
      return false;
    }
  });
}
