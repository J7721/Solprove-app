// Email sending via Resend's simple HTTP API (no extra library needed).
export function emailEnabled() {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail({ to, subject, html }) {
  const from = process.env.EMAIL_FROM || "Solprove <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || `Resend error ${res.status}`);
  return data;
}
