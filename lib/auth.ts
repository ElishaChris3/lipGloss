import crypto from "crypto";

// Admin credentials. Defaults match what was requested; override in .env.local
// (ADMIN_USER / ADMIN_PASS / ADMIN_SECRET) for production.
export const ADMIN_USER = process.env.ADMIN_USER || "admin";
export const ADMIN_PASS = process.env.ADMIN_PASS || "Password@123";
const SECRET = process.env.ADMIN_SECRET || "lip-survey-dev-secret-change-me";

export const SESSION_COOKIE = "admin_session";

// The session cookie holds an HMAC of the credentials, not the credentials
// themselves. We recompute it on each request to verify.
export function sessionToken(): string {
  return crypto
    .createHmac("sha256", SECRET)
    .update(`${ADMIN_USER}:${ADMIN_PASS}`)
    .digest("hex");
}

export function checkCredentials(username: string, password: string): boolean {
  return username === ADMIN_USER && password === ADMIN_PASS;
}

export function isValidSession(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const expected = sessionToken();
  // constant-time compare
  const a = Buffer.from(cookieValue);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
