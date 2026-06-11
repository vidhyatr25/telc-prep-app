import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, readJsonBody, sanitizeProgressPayload } from "@/lib/security";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const progress = await prisma.userProgress.upsert({
    where: { userId },
    update: {},
    create: { userId, data: "{}" },
  });

  const rawProgress = (() => {
    try {
      return JSON.parse(progress.data || "{}");
    } catch {
      return {};
    }
  })();
  const parsed = sanitizeProgressPayload(rawProgress);
  return NextResponse.json(parsed ?? {});
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rateLimit = checkRateLimit(`progress:${userId}`, 120, 60 * 1000);
  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: "Too many progress updates. Please slow down." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } }
    );
  }

  const parsed = await readJsonBody(request, 64 * 1024);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }

  const progress = sanitizeProgressPayload(parsed.data);
  if (!progress) {
    return NextResponse.json({ error: "Invalid progress payload" }, { status: 400 });
  }

  const data = JSON.stringify(progress);
  await prisma.userProgress.upsert({
    where: { userId },
    update: { data },
    create: { userId, data },
  });

  return NextResponse.json({ ok: true });
}
