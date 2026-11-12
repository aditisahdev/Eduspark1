import { json, body, needAdmin, STATUSES, safe } from "../../../_lib/common.js";
export const onRequestPatch = safe(async ({ request, env, params }) => {
  const deny = await needAdmin(env, request); if (deny) return deny;
  if (!/^\d+$/.test(params.id)) return json({ error: "Bad id" }, 400);
  const b = await body(request);
  if (!STATUSES.includes(b.status)) return json({ error: "Bad status" }, 400);
  await env.DB.prepare("UPDATE enquiries SET status=? WHERE id=?").bind(b.status, Number(params.id)).run();
  return json({ ok: true });
});
export const onRequestDelete = safe(async ({ request, env, params }) => {
  const deny = await needAdmin(env, request); if (deny) return deny;
  if (!/^\d+$/.test(params.id)) return json({ error: "Bad id" }, 400);
  await env.DB.prepare("DELETE FROM enquiries WHERE id=?").bind(Number(params.id)).run();
  return json({ ok: true });
});
