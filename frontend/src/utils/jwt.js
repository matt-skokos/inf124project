// src/utils/jwt.js

/**
 * Safely parse a JWT’s payload. Returns null if invalid.
 */
export function parseJwt(token) {
  try {
    // Grab the payload (the middle “.” segment)
    let base64Url = token.split(".")[1];
    // Convert from base64url to base64
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    // Add padding if needed
    const padding = base64.length % 4;
    if (padding) base64 += "=".repeat(4 - padding);
    // atob → decodeURIComponent → JSON.parse
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Returns true if the given JWT string is invalid or already expired.
 */
export function isTokenExpired(token) {
  if (!token) return true;
  const payload = parseJwt(token);
  if (!payload || typeof payload.exp !== "number") return true;
  // payload.exp is in seconds; Date.now() is ms
  return payload.exp < Date.now() / 1000;
}

/**
 * Returns how many milliseconds remain until this token expires.
 * If token is invalid or already past-expiry, returns 0.
 */
export function msUntilExpiration(token) {
  if (!token) return 0;
  const payload = parseJwt(token);
  if (!payload || typeof payload.exp !== "number") return 0;
  const nowSec = Date.now() / 1000;
  const diffSec = payload.exp - nowSec;
  return diffSec > 0 ? diffSec * 1000 : 0;
}
