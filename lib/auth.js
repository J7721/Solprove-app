// Server-side: turn a request's Bearer token into a verified user (or null).
import { createClient } from "@supabase/supabase-js";

let admin = null;
function getAdmin() {
  if (!admin) {
    admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }
  return admin;
}

export async function getUserFromRequest(req) {
  try {
    const header = req.headers.get("authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return null;
    const { data, error } = await getAdmin().auth.getUser(token);
    if (error) return null;
    return data.user; // { id, email, ... }
  } catch {
    return null;
  }
}
