import { NextResponse } from "next/server";
import { firebaseAdmin } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";
import client from "../../client";

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

    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const decoded = await firebaseAdmin.auth().verifyIdToken(token);

    const retrievedUid = decoded.uid;

    const userCacheKey = `user:${retrievedUid}`;

    const userCachedData = await client.get(userCacheKey);

    if (userCachedData) {
      return NextResponse.json(JSON.parse(userCachedData));
    }

    const firebase_vals = {
      email: decoded.email || "",
      name: decoded.name || "",
      picture: decoded.picture || "",
    };

    const existingUser = await prisma.user.findUnique({
      where: { id: retrievedUid },
    });

    const userName = existingUser
      ? existingUser.userName
      : await generateUniqueUsername(
          firebase_vals.name || firebase_vals.email?.split("@")[0],
        );

    if (!firebase_vals.email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { id: retrievedUid },
      update: {
        email: firebase_vals.email,
        ...((!existingUser?.name ||
          existingUser.name === firebase_vals.name) && {
          name: firebase_vals.name,
        }),
        ...((!existingUser?.avatarUrl ||
          existingUser.avatarUrl === firebase_vals.picture) && {
          avatarUrl: firebase_vals.picture,
        }),
      },
      create: {
        id: retrievedUid,
        name: firebase_vals.name,
        email: firebase_vals.email,
        avatarUrl: firebase_vals.picture,
        userName,
      },
    });

    //? ...((condtion) && { field: value }) is a way to conditionally include fields in an object. If the condition is true, the field will be included with the specified value; if false, it will be omitted entirely from the object.

    const response = NextResponse.json({ user });

    await client.setex(
      userCacheKey,
      60 * 60 * 24 * 7,
      JSON.stringify({ user }),
    );

    const expiresIn = 60 * 60 * 24 * 7 * 1000;
    const sessionCookie = await firebaseAdmin
      .auth()
      .createSessionCookie(token, { expiresIn });

    response.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000,
    });

    return response;
  } catch (error) {
    console.error("Auth sync error:", error);

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// 1. User login/signup -> we send token from frontend
// 2. We extract token -> verify it exist or not -> then verify it token  is correct by using firebaseAdmin
// 3. Then we extract uid and verify it in db if exist or not (login) and if doesn't exist we create new user (signup)
// 4. Then create a sessionCookie a function provided by firebaseAdmin to create a session cookie which can be used to create session cookie nd we can use verifySessionCookie to verify the cookie everytime instead of sending the token id from frontend every time nd verifying it every time, also the token id expiry time is 1hr.
// 5. This way it's more secure and Server handling the verification only client side no need to interfare each time.
