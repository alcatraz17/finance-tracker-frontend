/**
 * Reads the expiration timestamp inside the JWT token.
 * Returns true if the token is expired or will expire within 30 seconds.
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    // JWT structure is Header.Payload.Signature
    // The payload (index 1) is base64 encoded JSON
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return true;

    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson) as { exp?: number };

    if (!payload.exp) return true;

    // Convert exp (seconds) to milliseconds
    const expirationTimeMs = payload.exp * 1000;
    const safetyBufferMs = 30 * 1000; // 30-second cushion

    return Date.now() >= expirationTimeMs - safetyBufferMs;
  } catch {
    return true;
  }
}
