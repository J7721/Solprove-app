import { getUserFromRequest } from "../../../../lib/auth";
import { listMessages, sendMessage } from "../../../../lib/social";

// GET ?friendId=... — a message thread. Only works between existing friends (enforced
// inside sendMessage on write; reads here are scoped to the two participants anyway).
export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!user) return Response.json({ error: "Please sign in." }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const friendId = searchParams.get("friendId");
    const messages = await listMessages(user.id, friendId);
    return Response.json({ messages });
  } catch (e) {
    console.error(e);
    return Response.json({ error: e.message || "Couldn't load messages." }, { status: 500 });
  }
}

// POST { friendId, body } — send a message. Text only, friends-only, no links.
export async function POST(req) {
  const user = await getUserFromRequest(req);
  if (!user) return Response.json({ error: "Please sign in." }, { status: 401 });

  try {
    const { friendId, body } = await req.json();
    const result = await sendMessage(user.id, friendId, body);
    if (result.error) return Response.json({ error: result.error }, { status: 400 });
    return Response.json(result);
  } catch (e) {
    console.error(e);
    return Response.json({ error: e.message || "Couldn't send message." }, { status: 500 });
  }
}
