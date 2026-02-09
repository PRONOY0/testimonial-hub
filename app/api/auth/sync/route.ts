import { NextResponse } from "next/server";
import { firebaseAdmin } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";

async function generateUniqueUsername(name: string) {
  const base = name.toLowerCase().replace(/[^a-z0-9]/g, "");

  let username = base;
  let counter = 0;

  while (true) {
    const exists = await prisma.user.findUnique({
      where: { userName: username },
    });

    if (!exists) return username;

    counter++;
    username = `${base}${counter}`;
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];

    const decoded = await firebaseAdmin.auth().verifyIdToken(token);

    const { uid, email, name, picture } = decoded;

    const existingUser = await prisma.user.findUnique({
      where: { id: uid },
    });


    const userName = existingUser ? existingUser.userName : await generateUniqueUsername(name ?? email?.split("@")[0]);

    if (!email) {
      return NextResponse.json(
        {
          error: "Invalid token",
        },
        {
          status: 400,
        },
      );
    }

    const user = await prisma.user.upsert({
      where: { id: uid },
      update: {
        email,
        name,
        avatarUrl: picture,
      },
      create: {
        id: uid,
        name: name,
        email: email,
        avatarUrl: picture,
        userName,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth sync error:", error);

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
