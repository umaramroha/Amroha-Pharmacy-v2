import { prisma } from "@/lib/prisma";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  /** milliseconds until the current window resets */
  resetIn: number;
};

type RateLimitOptions = {
  /**
   * What to do if the database call fails.
   * true  (default) = let the request through (same behaviour as before)
   * false           = block the request (recommended for login endpoints
   *                   once you have confirmed the "RateLimit" table exists)
   */
  failOpen?: boolean;
};

// Defaults used by the older checkRateLimit() helper (login / register)
const DEFAULT_MAX_ATTEMPTS = 5;
const DEFAULT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Atomic fixed-window rate limiter.
 *
 * One single INSERT ... ON CONFLICT DO UPDATE statement does the whole job,
 * so two parallel requests can never read the same counter and both slip
 * through (the old SELECT-then-UPDATE version had that race).
 *
 * The time comparison uses the database clock (now()), so it does not depend
 * on the clock of the serverless function.
 */
export async function rateLimit(
  key: string,
  max: number,
  windowMs: number,
  options: RateLimitOptions = {}
): Promise<RateLimitResult> {
  const { failOpen = true } = options;
  const windowSeconds = windowMs / 1000;

  try {
    const rows = await prisma.$queryRaw<
      { count: number; resetInMs: number }[]
    >`
      INSERT INTO "RateLimit" ("key", "count", "resetAt")
      VALUES (
        ${key},
        1,
        now() + make_interval(secs => ${windowSeconds}::double precision)
      )
      ON CONFLICT ("key") DO UPDATE SET
        "count" = CASE
          WHEN "RateLimit"."resetAt" <= now() THEN 1
          ELSE "RateLimit"."count" + 1
        END,
        "resetAt" = CASE
          WHEN "RateLimit"."resetAt" <= now()
            THEN now() + make_interval(secs => ${windowSeconds}::double precision)
          ELSE "RateLimit"."resetAt"
        END
      RETURNING
        "count"::int AS "count",
        (EXTRACT(EPOCH FROM ("RateLimit"."resetAt" - now())) * 1000)::float8 AS "resetInMs"
    `;

    const row = rows[0];
    if (!row) throw new Error("Rate limit query returned no row");

    const count = Number(row.count);
    const resetIn = Math.max(0, Math.round(Number(row.resetInMs)));

    // Housekeeping: on ~1% of calls, delete rows that expired over a day ago.
    // (Keeps the table small without needing a separate cron job.)
    if (Math.random() < 0.01) {
      await prisma.$executeRaw`
        DELETE FROM "RateLimit" WHERE "resetAt" < now() - interval '1 day'
      `.catch(() => undefined);
    }

    return {
      allowed: count <= max,
      remaining: Math.max(0, max - count),
      resetIn,
    };
  } catch (err) {
    console.error("Rate limit error:", err);
    if (failOpen) {
      return { allowed: true, remaining: max, resetIn: windowMs };
    }
    return { allowed: false, remaining: 0, resetIn: windowMs };
  }
}

/**
 * Backward-compatible helper: 5 attempts per 15 minutes.
 * Login, admin login and register keep calling this, so they need no changes.
 */
export async function checkRateLimit(key: string): Promise<RateLimitResult> {
  return rateLimit(key, DEFAULT_MAX_ATTEMPTS, DEFAULT_WINDOW_MS);
}

export async function resetRateLimit(key: string) {
  try {
    await prisma.$executeRaw`
      DELETE FROM "RateLimit" WHERE "key" = ${key}
    `;
  } catch (err) {
    console.error("Reset rate limit error:", err);
  }
}
