type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimits = new Map<string, RateLimitEntry>();

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request.headers.get("x-real-ip") || "unknown";
}

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = rateLimits.get(key);

  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  if (current.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
  }

  current.count += 1;
  return { ok: true, retryAfter: 0 };
}

export async function readJsonBody(request: Request, maxBytes: number) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > maxBytes) {
    return { ok: false as const, error: "Request body is too large.", status: 413 };
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).length > maxBytes) {
    return { ok: false as const, error: "Request body is too large.", status: 413 };
  }

  try {
    return { ok: true as const, data: JSON.parse(text) as unknown };
  } catch {
    return { ok: false as const, error: "Invalid JSON payload.", status: 400 };
  }
}

export function normalizeEmail(value: unknown) {
  const email = String(value ?? "").trim().toLowerCase();
  const valid =
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return valid ? email : "";
}

export function normalizeName(value: unknown) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, 80);
}

function boundedNumber(value: unknown, min: number, max: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(Math.max(value, min), max)
    : min;
}

function boundedInteger(value: unknown, min: number, max: number) {
  return Math.round(boundedNumber(value, min, max));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function sanitizeProgressPayload(value: unknown) {
  if (!isRecord(value)) return null;

  const unitProgress: Record<string, unknown> = {};
  const sourceUnits = isRecord(value.unitProgress) ? value.unitProgress : {};
  for (const [rawUnitId, rawUnit] of Object.entries(sourceUnits).slice(0, 50)) {
    if (!/^\d+$/.test(rawUnitId) || !isRecord(rawUnit)) continue;

    const unitId = boundedInteger(rawUnit.unitId ?? Number(rawUnitId), 1, 100);
    const lessonsCompleted = Array.isArray(rawUnit.lessonsCompleted)
      ? rawUnit.lessonsCompleted
          .slice(0, 100)
          .map((lesson) => boundedInteger(lesson, 0, 1000))
          .filter((lesson, index, lessons) => lessons.indexOf(lesson) === index)
      : [];

    unitProgress[rawUnitId] = {
      unitId,
      lessonsCompleted,
      quizScore: rawUnit.quizScore === undefined ? undefined : boundedInteger(rawUnit.quizScore, 0, 100),
      quizCompleted: Boolean(rawUnit.quizCompleted),
      xpEarned: boundedInteger(rawUnit.xpEarned, 0, 100000),
    };
  }

  const mockTestResults = Array.isArray(value.mockTestResults)
    ? value.mockTestResults.slice(0, 100).filter(isRecord).map((result) => ({
        testId: boundedInteger(result.testId, 0, 10000),
        score: boundedInteger(result.score, 0, 10000),
        totalPoints: boundedInteger(result.totalPoints, 0, 10000),
        passed: Boolean(result.passed),
        date: String(result.date ?? "").slice(0, 80),
      }))
    : [];

  return {
    unitProgress,
    mockTestResults,
    totalXP: boundedInteger(value.totalXP, 0, 1000000),
    streak: boundedInteger(value.streak, 0, 10000),
    lastActiveDate: String(value.lastActiveDate ?? "").slice(0, 80),
    flashcardXP: boundedInteger(value.flashcardXP, 0, 1000000),
    memoryXP: boundedInteger(value.memoryXP, 0, 1000000),
  };
}
