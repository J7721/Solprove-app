import { getUserFromRequest } from "../../../../lib/auth";
import { blockUser, reportUser } from "../../../../lib/social";

// POST { action: "block" | "report", targetId, reason? }
export async function POST(req) {
  const user = await getUserFromRequest(req);
  if (!user) return Response.json({ error: "Please sign in." }, { status: 401 });

  try {
    const { action, targetId, reason } = await req.json();
    if (action === "block") {
      const result = await blockUser(user.id, targetId);
      if (result.error) return Response.json({ error: result.error }, { status: 400 });
      return Response.json(result);
    }
    if (action === "report") {
      const result = await reportUser(user.id, targetId, reason);
      if (result.error) return Response.json({ error: result.error }, { status: 400 });
      return Response.json(result);
    }
    return Response.json({ error: "Unknown action." }, { status: 400 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: e.message || "Something went wrong." }, { status: 500 });
  }
}
