// Shared helpers for the Cloudflare Pages Functions. Storage = D1 (SQLite) bound as env.DB.
const enc = new TextEncoder();
export const STATUSES = ["new", "contacted", "done"];

export const json = (obj, status = 200, headers = {}) =>
  new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...headers } });

export const clean = (v, max) => String(v ?? "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, max);
export const ipOf = req => req.headers.get("CF-Connecting-IP") || (req.headers.get("X-Forwarded-For") || "").split(",")[0].trim() || "unknown";

export async function body(req) { try { const b = await req.json(); return b && typeof b === "object" ? b : {}; } catch { return {}; } }

// constant-time compare of two strings (via SHA-256 digests)
export async function same(a, b) {
  const [x, y] = await Promise.all([a, b].map(async s => new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(String(s))))));
  let d = 0; for (let i = 0; i < x.length; i++) d |= x[i] ^ y[i]; return d === 0;
}

// rate limit: true when `key` has been used more than `max` times in the last `seconds`
export async function limited(env, key, max, seconds) {
  const now = Math.floor(Date.now() / 1000);
  const r = await env.DB.prepare(
    `INSERT INTO rl(key,n,reset) VALUES(?1,1,?2+?3)
     ON CONFLICT(key) DO UPDATE SET n = CASE WHEN reset < ?2 THEN 1 ELSE n+1 END, reset = CASE WHEN reset < ?2 THEN ?2+?3 ELSE reset END
     RETURNING n`).bind(key, now, seconds).first();
  return r.n > max;
}

// ---- stateless admin session: signed cookie "exp.signature"
const b64url = bytes => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
async function hmac(secret, msg) {
  const k = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(new Uint8Array(await crypto.subtle.sign("HMAC", k, enc.encode(msg))));
}
const SESSION_S = 12 * 3600;
export async function makeCookie(env, req) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_S;
  const secure = new URL(req.url).protocol === "https:" ? "; Secure" : "";
  return `sid=${exp}.${await hmac(env.SESSION_SECRET, String(exp))}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_S}${secure}`;
}
export const clearCookie = "sid=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0";
export async function isAdmin(env, req) {
  if (!env.SESSION_SECRET) return false;
  const m = /(?:^|;\s*)sid=(\d+)\.([\w-]+)/.exec(req.headers.get("Cookie") || "");
  if (!m || Number(m[1]) < Date.now() / 1000) return false;
  return same(m[2], await hmac(env.SESSION_SECRET, m[1]));
}
export const needAdmin = async (env, req) => (await isAdmin(env, req)) ? null : json({ error: "Not logged in" }, 401);

export const csvCell = v => { let s = String(v ?? ""); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; };

// list enquiries with optional search + status filter
export async function listRows(env, url) {
  const q = clean(url.searchParams.get("q"), 80), st = clean(url.searchParams.get("status"), 12);
  const where = [], args = [];
  if (q) { where.push("(name LIKE ? OR phone LIKE ? OR email LIKE ? OR college LIKE ? OR city LIKE ? OR course LIKE ? OR message LIKE ?)"); for (let i = 0; i < 7; i++) args.push("%" + q + "%"); }
  if (STATUSES.includes(st)) { where.push("status = ?"); args.push(st); }
  const sql = "SELECT id,created_at,name,phone,email,college,city,course,message,source,status FROM enquiries" + (where.length ? " WHERE " + where.join(" AND ") : "") + " ORDER BY id DESC LIMIT 2000";
  return (await env.DB.prepare(sql).bind(...args).all()).results;
}

// wrap: catch errors, never leak details
export const safe = fn => async ctx => { try { return await fn(ctx); } catch (e) { console.error(e); return json({ error: "Server error" }, 500); } };
