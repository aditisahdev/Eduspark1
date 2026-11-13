import { json, needAdmin, safe } from "../../_lib/common.js";
export const onRequestGet = safe(async ({ request, env }) => (await needAdmin(env, request)) || json({ ok: true }));
