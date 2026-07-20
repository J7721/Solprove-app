import Anthropic from "@anthropic-ai/sdk";
import { CHAT_SYSTEM } from "../../../lib/prompts";

export const runtime = "nodejs";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }

  const { messages, context } = body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "No message." }, { status: 400 });
  }

  // Bound cost/context: keep the last few turns, cap each message's length.
  const trimmed = messages
    .slice(-8)
    .map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content || "").slice(0, 800),
    }))
    .filter(m => m.content.trim().length > 0);

  if (trimmed.length === 0) {
    return Response.json({ error: "No message." }, { status: 400 });
  }

  const system =
    context === "workspace"
      ? `${CHAT_SYSTEM}\n\n(This visitor is inside the logged-in workspace tool.)`
      : CHAT_SYSTEM;

  try {
    const msg = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 400,
      temperature: 0.4,
      system,
      messages: trimmed,
    });
    const text = msg.content.find(b => b.type === "text")?.text?.trim();
    return Response.json({ reply: text || "Sorry, I didn't catch that — could you rephrase?" });
  } catch (err) {
    console.error("chat route error", err);
    return Response.json(
      { error: "The assistant is temporarily unavailable — email hello@solprove.co.uk and we'll get back to you." },
      { status: 500 }
    );
  }
}
