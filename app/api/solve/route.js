import Anthropic from "@anthropic-ai/sdk";
import { SOLVE_SYSTEM } from "../../../lib/prompts";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  try {
    const { question, tier, imageBase64, imageType } = await req.json();

    const content = [];
    if (imageBase64) {
      content.push({
        type: "image",
        source: { type: "base64", media_type: imageType || "image/jpeg", data: imageBase64 },
      });
    }
    content.push({
      type: "text",
      text: `Tier: ${tier || "foundation"}.\nQuestion: ${question || "(see photo)"}\nRespond with the JSON format only.`,
    });

    const msg = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1500,
      temperature: 0,
      system: SOLVE_SYSTEM,
      messages: [{ role: "user", content }],
    });

    const text = msg.content.find(b => b.type === "text")?.text || "";
    const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
    return Response.json(json);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Could not solve this question. Try re-phrasing or a clearer photo." }, { status: 500 });
  }
}
