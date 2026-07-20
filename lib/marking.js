// Two-stage deterministic marking, shared by the API route and the consistency script.
import Anthropic from "@anthropic-ai/sdk";
import { EXTRACT_SYSTEM, MARK_SYSTEM } from "./prompts.js";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function callJson(system, content, maxTokens = 1600) {
  const msg = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: maxTokens,
    temperature: 0,
    system,
    messages: [{ role: "user", content }],
  });
  const text = msg.content.find(b => b.type === "text")?.text || "";
  return JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
}

export async function markAttempt({ question, attempt, tier, rubric, attemptImageBase64, attemptImageType }) {
  // STAGE 1: faithful extraction, no judgement — supports typed text and/or a photo of the working
  let extractContent;
  if (attemptImageBase64) {
    extractContent = [
      { type: "image", source: { type: "base64", media_type: attemptImageType || "image/jpeg", data: attemptImageBase64 } },
      { type: "text", text: `The student's attempt is shown in the photo above.${attempt ? ` They also typed: ${attempt}` : ""} Extract it faithfully.` },
    ];
  } else {
    extractContent = `Student's attempt (copy faithfully):\n${attempt}`;
  }
  const extracted = await callJson(EXTRACT_SYSTEM, extractContent, 800);

  // STAGE 2: rubric-based marking.
  // Bank questions carry a STORED rubric — the examiner must use it verbatim.
  const rubricInstruction = rubric
    ? `USE THIS EXACT RUBRIC — do not invent your own:\n${JSON.stringify(rubric, null, 2)}`
    : `Write the rubric first, then award marks.`;

  const marked = await callJson(
    MARK_SYSTEM,
    `Tier: ${tier || "foundation"}\nQuestion: ${question}\n${rubricInstruction}\nStudent's extracted working:\n${JSON.stringify(extracted, null, 2)}\nJSON only.`
  );

  return { extracted, ...marked };
}
