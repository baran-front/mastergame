import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getMe } from "./lib/fetchs";

// Simple in-memory TTL cache keyed by token to avoid re-fetching between page transitions
const TTL_MS = 5_000; // 5 seconds
type AuthCacheEntry = { ok: boolean; expiresAt: number };
const authCache = new Map<string, AuthCacheEntry>();

function pruneExpiredEntries(now: number) {
  for (const [token, entry] of authCache.entries()) {
    if (entry.expiresAt <= now) {
      authCache.delete(token);
    }
  }
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value || "";

  // Fast path: if no token, do not fetch
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Check cache
  const cached = authCache.get(token);
  const now = Date.now();
  pruneExpiredEntries(now);
  if (cached && cached.expiresAt > now) {
    return cached.ok
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/", request.url));
  }

  // Miss/expired: fetch and cache
  const user = await getMe({ token });
  const ok = user.status === 200;
  authCache.set(token, { ok, expiresAt: now + TTL_MS });

  if (!ok) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/dashboard/:path*",
};
