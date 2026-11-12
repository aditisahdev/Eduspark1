import { json, clearCookie } from "../../_lib/common.js";
export const onRequestPost = () => json({ ok: true }, 200, { "Set-Cookie": clearCookie });
export const onRequest = () => json({ error: "POST only" }, 405);
