import { createMiddleware } from "hono/factory";

// In-memory only: resets on deploy and does not coordinate across replicas.
const store = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

export function rateLimit(options: { windowMs: number; max: number }) {
  const { windowMs, max } = options;

  return createMiddleware(async (c, next) => {
    const ip = getClientIp(c.req.raw);
    const now = Date.now();
    let entry = store.get(ip);

    if (!entry || now >= entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      store.set(ip, entry);
    }

    entry.count += 1;

    if (entry.count > max) {
      return c.json({ error: "Too many requests" }, 429);
    }

    return await next();
  });
}
