import { needAdmin, listRows, csvCell, safe } from "../../_lib/common.js";
export const onRequestGet = safe(async ({ request, env }) => {
  const deny = await needAdmin(env, request); if (deny) return deny;
  const cols = ["id", "created_at", "name", "phone", "email", "college", "city", "course", "message", "source", "status"];
  const rows = await listRows(env, new URL(request.url));
  const csv = [cols.join(","), ...rows.map(r => cols.map(c => csvCell(r[c])).join(","))].join("\r\n");
  return new Response("﻿" + csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="eduspark-enquiries.csv"', "Cache-Control": "no-store" } });
});
