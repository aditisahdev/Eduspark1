import { json, body, same, limited, ipOf, makeCookie, safe } from "../../_lib/common.js";
export const onRequestPost = safe(async ({ request, env }) => {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD || !env.SESSION_SECRET) return json({ error: "Admin login is not configured" }, 500);
  if (await limited(env, "login:" + ipOf(request), 8, 900)) return json({ error: "Too many attempts. Wait 15 minutes." }, 429);
  const b = await body(request);
  const okE = await same(String(b.email || "").trim().toLowerCase(), env.ADMIN_EMAIL.trim().toLowerCase());
  const okP = await same(b.password || "", env.ADMIN_PASSWORD);
  if (!(okE && okP)) return json({ error: "Wrong email or password" }, 401);
  return json({ ok: true }, 200, { "Set-Cookie": await makeCookie(env, request) });
});
export const onRequest = () => json({ error: "POST only" }, 405);
