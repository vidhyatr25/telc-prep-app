import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const progress = await prisma.userProgress.upsert({
    where: { userId },
    update: {},
    create: { userId, data: "{}" },
  });

  return NextResponse.json(JSON.parse(progress.data || "{}"));
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid progress payload" }, { status: 400 });
  }

  await prisma.userProgress.upsert({
    where: { userId },
    update: { data: JSON.stringify(body) },
    create: { userId, data: JSON.stringify(body) },
  });

  return NextResponse.json({ ok: true });
}
