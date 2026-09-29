import { prisma } from "@/lib/prisma";

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export async function checkRateLimit(key: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetIn: number;
}> {
  const now = new Date();

  try {
    // Use raw query since RateLimit is not in Prisma schema
    const existing: any[] = await prisma.$queryRaw`
      SELECT "key", "count", "resetAt"
      FROM "RateLimit"
      WHERE "key" = ${key}
    `;

    // No record — create one
    if (!existing || existing.length === 0) {
      const resetAt = new Date(Date.now() + WINDOW_MS);
      await prisma.$executeRaw`
        INSERT INTO "RateLimit" ("key", "count", "resetAt")
        VALUES (${key}, 1, ${resetAt})
      `;
      return {
        allowed: true,
        remaining: MAX_ATTEMPTS - 1,
        resetIn: WINDOW_MS,
      };
    }

    const record = existing[0];
    const resetAt = new Date(record.resetAt);

    // Window expired — reset
    if (resetAt < now) {
      const newResetAt = new Date(Date.now() + WINDOW_MS);
      await prisma.$executeRaw`
        UPDATE "RateLimit"
        SET "count" = 1, "resetAt" = ${newResetAt}
        WHERE "key" = ${key}
      `;
      return {
        allowed: true,
        remaining: MAX_ATTEMPTS - 1,
        resetIn: WINDOW_MS,
      };
    }

    // Limit reached
    if (record.count >= MAX_ATTEMPTS) {
      return {
        allowed: false,
        remaining: 0,
        resetIn: resetAt.getTime() - now.getTime(),
      };
    }

    // Increment
    await prisma.$executeRaw`
      UPDATE "RateLimit"
      SET "count" = "count" + 1
      WHERE "key" = ${key}
    `;

    return {
      allowed: true,
      remaining: MAX_ATTEMPTS - record.count - 1,
      resetIn: resetAt.getTime() - now.getTime(),
    };
  } catch (err) {
    console.error("Rate limit error:", err);
    // Fail open — allow if DB fails
    return { allowed: true, remaining: MAX_ATTEMPTS, resetIn: WINDOW_MS };
  }
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
