import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory token bucket rate limiter for Edge Runtime.
// Note: In production serverless environments, this map is instantiated per-instance.
// For robust cluster-wide rate limiting, one would typically use Redis (e.g., Upstash).
// This serves as an excellent Edge-compatible defense guard.
interface TokenBucket {
  tokens: number;
  lastRefilled: number;
}

const LIMIT = 20; // Max 20 conversions
const REFILL_RATE_MS = 3 * 60 * 1000; // 1 token every 3 minutes (20/hour)
const ipMap = new Map<string, TokenBucket>();

// Periodically clean up stale IPs to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, bucket] of ipMap.entries()) {
    if (now - bucket.lastRefilled > 60 * 60 * 1000) {
      ipMap.delete(ip);
    }
  }
}, 10 * 60 * 1000);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply only to API conversion routes
  if (pathname.startsWith("/api/convert")) {
    const ip = (request as any).ip || request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const now = Date.now();

    let bucket = ipMap.get(ip);

    if (!bucket) {
      bucket = { tokens: LIMIT, lastRefilled: now };
      ipMap.set(ip, bucket);
    } else {
      // Calculate token refills
      const elapsed = now - bucket.lastRefilled;
      const tokensToAdd = Math.floor(elapsed / REFILL_RATE_MS);

      if (tokensToAdd > 0) {
        bucket.tokens = Math.min(LIMIT, bucket.tokens + tokensToAdd);
        bucket.lastRefilled = bucket.lastRefilled + tokensToAdd * REFILL_RATE_MS;
      }
    }

    // Check tokens
    if (bucket.tokens <= 0) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Rate limit exceeded. You can perform up to 20 conversions per hour.",
          code: "RATE_LIMIT_EXCEEDED",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": Math.round(REFILL_RATE_MS / 1000).toString(),
          },
        }
      );
    }

    // Consume 1 token
    bucket.tokens -= 1;
    ipMap.set(ip, bucket);
  }

  return NextResponse.next();
}

// Config to specify which paths this middleware applies to
export const config = {
  matcher: "/api/convert/:path*",
};
