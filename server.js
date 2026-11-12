// Eduspark: static site + enquiry API + admin panel. No npm packages needed (Node 22.5+).
//   node server.js              -> http://localhost:8000   (PORT env var changes it)
//   admin panel                 -> /admin/   password: ADMIN_PASSWORD env var, or data/.admin_password (auto-created)
"use strict";
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 8000;
const DATA = path.join(ROOT, "data");
fs.mkdirSync(DATA, { recursive: true });

// ---------- admin password
let ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const pwFile = path.join(DATA, ".admin_password");
if (!ADMIN_PASSWORD) {
  if (fs.existsSync(pwFile)) ADMIN_PASSWORD = fs.readFileSync(pwFile, "utf8").trim();
  else {
    ADMIN_PASSWORD = crypto.randomBytes(9).toString("base64url");
    fs.writeFileSync(pwFile, ADMIN_PASSWORD + "\n", { mode: 0o600 });
    console.log("\n  Admin password created (saved in data/.admin_password):  " + ADMIN_PASSWORD + "\n");
  }
}

let ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const emFile = path.join(DATA, ".admin_email");
if (!ADMIN_EMAIL) {
  if (fs.existsSync(emFile)) ADMIN_EMAIL = fs.readFileSync(emFile, "utf8").trim().toLowerCase();
  else { ADMIN_EMAIL = "admin@eduspark.local"; fs.writeFileSync(emFile, ADMIN_EMAIL + "\n", { mode: 0o600 }); console.log("  Admin email created (change it in data/.admin_email):  " + ADMIN_EMAIL); }
}

// ---------- database
const db = new DatabaseSync(path.join(DATA, "enquiries.db"));
db.exec(`CREATE TABLE IF NOT EXISTS enquiries(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT DEFAULT '',
  college TEXT DEFAULT '', city TEXT DEFAULT '', course TEXT DEFAULT '',
  message TEXT DEFAULT '', source TEXT DEFAULT '', status TEXT NOT NULL DEFAULT 'new',
  ip TEXT DEFAULT '')`);
// daily backup copy of the database (kept for 14 days), taken at start-up and every 6 hours
function backup() {
  try {
    const dir = path.join(DATA, "backups"); fs.mkdirSync(dir, { recursive: true });
    db.exec("PRAGMA wal_checkpoint(TRUNCATE)");
    fs.copyFileSync(path.join(DATA, "enquiries.db"), path.join(dir, "enquiries-" + new Date().toISOString().slice(0, 10) + ".db"));
    fs.readdirSync(dir).filter(f => f.endsWith(".db")).sort().slice(0, -14).forEach(f => fs.unlinkSync(path.join(dir, f)));
  } catch (e) { console.error("backup failed:", e.message); }
}
backup(); setInterval(backup, 6 * 3600e3).unref();
const STATUSES = ["new", "contacted", "done"];

// ---------- helpers
const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif",
  ".svg": "image/svg+xml", ".webp": "image/webp", ".ico": "image/x-icon", ".txt": "text/plain; charset=utf-8", ".woff2": "font/woff2" };
const BLOCKED = /^\/(data|\.git|node_modules|server\.js|package(-lock)?\.json|\.)/;

const send = (res, code, body, headers = {}) => {
  res.writeHead(code, { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...headers });
  res.end(body);
};
const json = (res, code, obj, headers) => send(res, code, JSON.stringify(obj), { "Content-Type": "application/json", ...headers });
const clean = (v, max) => String(v ?? "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, max);
const ipOf = req => (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on("data", c => { size += c.length; if (size > 20000) { reject(new Error("too large")); req.destroy(); } else chunks.push(c); });
    req.on("end", () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString() || "{}")); } catch { reject(new Error("bad json")); } });
    req.on("error", reject);
  });
}

// simple in-memory rate limiter: key -> [timestamps]
const hits = new Map();
function limited(key, max, windowMs) {
  const now = Date.now(), arr = (hits.get(key) || []).filter(t => now - t < windowMs);
  arr.push(now); hits.set(key, arr);
  return arr.length > max;
}

// ---------- admin sessions
const sessions = new Map(); // token -> expiry
const SESSION_MS = 12 * 3600 * 1000;
const cookieOf = req => Object.fromEntries((req.headers.cookie || "").split(";").map(s => s.trim().split("=")).filter(a => a[0]));
const isAdmin = req => { const t = cookieOf(req).sid, e = t && sessions.get(t); if (e && e > Date.now()) return true; if (t) sessions.delete(t); return false; };
const sameBuf = (a, b) => { const x = crypto.createHash("sha256").update(a).digest(), y = crypto.createHash("sha256").update(b).digest(); return crypto.timingSafeEqual(x, y); };

// ---------- csv
const csvCell = v => { let s = String(v ?? ""); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; };

// ---------- api
async function api(req, res, url) {
  const p = url.pathname, m = req.method;

  if (p === "/api/enquiry" && m === "POST") {
    if (limited("enq:" + ipOf(req), 15, 3600e3)) return json(res, 429, { error: "Too many requests. Try again later." });
    let b; try { b = await readJson(req); } catch { return json(res, 400, { error: "Bad request" }); }
    const e = { name: clean(b.name, 80), phone: clean(b.phone, 20), email: clean(b.email, 120), college: clean(b.college, 160),
      city: clean(b.city, 60), course: clean(b.course, 80), message: clean(b.message, 500), source: clean(b.source, 30) };
    if (e.name.length < 2) return json(res, 400, { error: "Name is required" });
    if (!/^[0-9+ ]{10,14}$/.test(e.phone)) return json(res, 400, { error: "Valid phone is required" });
    if (e.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.email)) return json(res, 400, { error: "Invalid email" });
    db.prepare("INSERT INTO enquiries(name,phone,email,college,city,course,message,source,ip) VALUES(?,?,?,?,?,?,?,?,?)")
      .run(e.name, e.phone, e.email, e.college, e.city, e.course, e.message, e.source, ipOf(req));
    return json(res, 201, { ok: true });
  }

  if (p === "/api/admin/login" && m === "POST") {
    if (limited("login:" + ipOf(req), 8, 15 * 60e3)) return json(res, 429, { error: "Too many attempts. Wait 15 minutes." });
    let b; try { b = await readJson(req); } catch { return json(res, 400, { error: "Bad request" }); }
    const okEmail = sameBuf(String(b.email || "").trim().toLowerCase(), ADMIN_EMAIL), okPass = sameBuf(String(b.password || ""), ADMIN_PASSWORD);
    if (!(okEmail && okPass)) return json(res, 401, { error: "Wrong email or password" });
    const sid = crypto.randomBytes(24).toString("base64url"); sessions.set(sid, Date.now() + SESSION_MS);
    const secure = req.headers["x-forwarded-proto"] === "https" ? "; Secure" : "";
    return json(res, 200, { ok: true }, { "Set-Cookie": `sid=${sid}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_MS / 1000}${secure}` });
  }

  if (!p.startsWith("/api/admin/")) return json(res, 404, { error: "Not found" });
  if (!isAdmin(req)) return json(res, 401, { error: "Not logged in" });

  if (p === "/api/admin/logout" && m === "POST") {
    sessions.delete(cookieOf(req).sid);
    return json(res, 200, { ok: true }, { "Set-Cookie": "sid=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0" });
  }
  if (p === "/api/admin/session" && m === "GET") return json(res, 200, { ok: true });

  const list = () => {
    const q = clean(url.searchParams.get("q"), 80), st = clean(url.searchParams.get("status"), 12);
    const where = [], args = [];
    if (q) { where.push("(name LIKE ? OR phone LIKE ? OR email LIKE ? OR college LIKE ? OR city LIKE ? OR course LIKE ? OR message LIKE ?)"); for (let i = 0; i < 7; i++) args.push("%" + q + "%"); }
    if (STATUSES.includes(st)) { where.push("status = ?"); args.push(st); }
    return db.prepare("SELECT id,created_at,name,phone,email,college,city,course,message,source,status FROM enquiries" +
      (where.length ? " WHERE " + where.join(" AND ") : "") + " ORDER BY id DESC LIMIT 2000").all(...args);
  };

  if (p === "/api/admin/enquiries" && m === "GET") {
    const counts = Object.fromEntries(db.prepare("SELECT status, COUNT(*) c FROM enquiries GROUP BY status").all().map(r => [r.status, r.c]));
    return json(res, 200, { rows: list(), counts });
  }
  if (p === "/api/admin/export.csv" && m === "GET") {
    const cols = ["id", "created_at", "name", "phone", "email", "college", "city", "course", "message", "source", "status"];
    const csv = [cols.join(","), ...list().map(r => cols.map(c => csvCell(r[c])).join(","))].join("\r\n");
    return send(res, 200, "﻿" + csv, { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="eduspark-enquiries.csv"' });
  }

  const one = p.match(/^\/api\/admin\/enquiries\/(\d+)$/);
  if (one) {
    if (!(req.headers["content-type"] || "").includes("application/json") && m !== "DELETE") return json(res, 415, { error: "JSON only" });
    if (m === "PATCH") {
      let b; try { b = await readJson(req); } catch { return json(res, 400, { error: "Bad request" }); }
      if (!STATUSES.includes(b.status)) return json(res, 400, { error: "Bad status" });
      db.prepare("UPDATE enquiries SET status=? WHERE id=?").run(b.status, Number(one[1]));
      return json(res, 200, { ok: true });
    }
    if (m === "DELETE") { db.prepare("DELETE FROM enquiries WHERE id=?").run(Number(one[1])); return json(res, 200, { ok: true }); }
  }
  return json(res, 404, { error: "Not found" });
}

// ---------- static files
function serveStatic(req, res, url) {
  let rel = decodeURIComponent(url.pathname);
  if (rel === "/admin") return send(res, 301, "", { Location: "/admin/" });
  if (rel.endsWith("/")) rel += "index.html";
  if (rel === "/") rel = "/index.html";
  if (BLOCKED.test(rel) && !rel.startsWith("/admin/")) return send(res, 404, "Not found", { "Content-Type": "text/plain" });
  const file = path.normalize(path.join(ROOT, rel));
  if (!file.startsWith(ROOT + path.sep)) return send(res, 403, "Forbidden", { "Content-Type": "text/plain" });
  fs.readFile(file, (err, buf) => {
    const type = MIME[path.extname(file).toLowerCase()];
    if (err || !type) return send(res, 404, "Not found", { "Content-Type": "text/plain" });
    send(res, 200, buf, { "Content-Type": type });
  });
}

http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  (url.pathname.startsWith("/api/") ? api(req, res, url) : Promise.resolve(serveStatic(req, res, url)))
    .catch(err => { console.error(err); if (!res.headersSent) json(res, 500, { error: "Server error" }); });
}).listen(PORT, () => console.log(`Eduspark running at http://localhost:${PORT}  (admin: /admin/)`));
