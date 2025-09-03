import { getConnInfo } from 'hono/deno';
import { Context } from "hono"

export function htmlEncode(x: string) {
  return String(x)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function toDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("zh-Hans-CN", {}).format(date);
}

export function maskPass(p: string) {
  if (!p || typeof p !== "string") {
    console.error("unexpected pass:", p);
    return "";
  }
  return p.substring(0, 4) + ("*".repeat(5));
}

export function getClientIpAddress(c: Context) {
  return c.req.header("x-forwarded-for")
    || c.req.raw.headers.get("cf-connecting-ip")
    || c.req.raw.headers.get("x-real-ip") || getConnInfo(c).remote.address!
}