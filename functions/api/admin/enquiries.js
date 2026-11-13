import { json, needAdmin, listRows, safe } from "../../_lib/common.js";
export const onRequestGet = safe(async ({ request, env }) => {
  const deny = await needAdmin(env, request); if (deny) return deny;
  const rows = await listRows(env, new URL(request.url));
  const counts = {}; for (const r of (await env.DB.prepare("SELECT status, COUNT(*) c FROM enquiries GROUP BY status").all()).results) counts[r.status] = r.c;
  return json({ rows, counts });
});
