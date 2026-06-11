import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp, normalizeEmail, normalizeName, readJsonBody } from "@/lib/security";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const ipLimit = checkRateLimit(`signup:ip:${ip}`, 10, 15 * 60 * 1000);
  if (!ipLimit.ok) {
    return NextResponse.json(
      { error: "Too many signup attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(ipLimit.retryAfter) } }
    );
  }

  const parsed = await readJsonBody(request, 8 * 1024);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }

  const body = parsed.data as Record<string, unknown>;
  const email = normalizeEmail(body.email);
  const password = String(body.password ?? "");
  const name = normalizeName(body.name);

  if (!email) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const emailLimit = checkRateLimit(`signup:email:${email}`, 5, 60 * 60 * 1000);
  if (!emailLimit.ok) {
    return NextResponse.json(
      { error: "Too many signup attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(emailLimit.retryAfter) } }
    );
  }

  if (password.length < 8 || password.length > 128) {
    return NextResponse.json({ error: "Password must be between 8 and 128 characters." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ ok: true });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  try {
    await prisma.user.create({
      data: {
        email,
        name: name || null,
        passwordHash,
        progress: {
          create: { data: "{}" },
        },
      },
    });
  } catch {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
