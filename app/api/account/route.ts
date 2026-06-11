import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, readJsonBody } from "@/lib/security";

const DELETE_CONFIRMATION = "DELETE MY ACCOUNT";

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rateLimit = checkRateLimit(`delete-account:${userId}`, 5, 60 * 60 * 1000);
  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: "Too many deletion attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } }
    );
  }

  const parsed = await readJsonBody(request, 1024);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }

  const body = parsed.data as Record<string, unknown>;
  if (String(body.confirmation ?? "") !== DELETE_CONFIRMATION) {
    return NextResponse.json({ error: "Account deletion confirmation is required." }, { status: 400 });
  }

  await prisma.user.delete({ where: { id: userId } });

  return NextResponse.json({ ok: true });
}
