import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { firebaseAdmin } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import client from "../client";

// POST - Create/Update custom links
export async function POST(req: Request) {
  try {
    const cookie = (await cookies()).get("session")?.value;

    if (!cookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await firebaseAdmin
      .auth()
      .verifySessionCookie(cookie, true);

    const { uid } = decoded;

    const cacheKey = `user:${uid}:profile`;

    const cacheSettingKey = `user:${uid}:settings`;

    const cacheKey_auth = `user:${uid}`;

    await client.del(cacheKey);

    await client.del(cacheKey_auth);

    await client.del(cacheSettingKey);

    const { links } = await req.json();

    const newLinks = await prisma.customLink.create({
      data: {
        label: links.label,
        url: links.url,
        userId: uid,
        order: links.order,
      },
    });

    return NextResponse.json({ newLinks });
  } catch (error) {
    console.error("Error saving custom links:", error);
    return NextResponse.json(
      { error: "Failed to save links" },
      { status: 500 },
    );
  }
}
