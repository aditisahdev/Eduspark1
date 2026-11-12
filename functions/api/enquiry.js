import { json, clean, ipOf, body, limited, safe } from "../_lib/common.js";
export const onRequestPost = safe(async ({ request, env }) => {
  if (await limited(env, "enq:" + ipOf(request), 15, 3600)) return json({ error: "Too many requests. Try again later." }, 429);
  const b = await body(request);
  const e = { name: clean(b.name, 80), phone: clean(b.phone, 20), email: clean(b.email, 120), college: clean(b.college, 160),
    city: clean(b.city, 60), course: clean(b.course, 80), message: clean(b.message, 500), source: clean(b.source, 30) };
  if (e.name.length < 2) return json({ error: "Name is required" }, 400);
  if (!/^[0-9+ ]{10,14}$/.test(e.phone)) return json({ error: "Valid phone is required" }, 400);
  if (e.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.email)) return json({ error: "Invalid email" }, 400);
  await env.DB.prepare("INSERT INTO enquiries(name,phone,email,college,city,course,message,source,ip) VALUES(?,?,?,?,?,?,?,?,?)")
    .bind(e.name, e.phone, e.email, e.college, e.city, e.course, e.message, e.source, ipOf(request)).run();
  return json({ ok: true }, 201);
});
export const onRequest = () => json({ error: "POST only" }, 405);
