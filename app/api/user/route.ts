/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { firebaseAdmin } from "@/lib/firebase-admin";
import cloudinary from "@/lib/cloudinary";
import { validateUsername } from "@/lib/validation";
import client from "../client";

// GET /api/user - Fetch user details
// PATCH /api/user - Update user details
export async function GET(req: Request) {
  try {
    const cookie = (await cookies()).get("session")?.value;

    if (!cookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cacheKey = `session:${cookie}`;

    const cachedData = await client.get(cacheKey);
    let uid: string | undefined;

    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        uid = parsed?.uid;
      } catch (error) {
        console.error(error);
        uid = undefined;
      }
    } else {
      const decoded = await firebaseAdmin
        .auth()
        .verifySessionCookie(cookie, true);

      uid = decoded.uid;

      await client.setex(cacheKey, 60 * 60 * 24 * 7, JSON.stringify({ uid }));
    }

    if (!uid) {
      return NextResponse.json({ message: "UID not Found" }, { status: 401 });
    }

    const cacheUserKey = `user:${uid}:settings`;

    const cacheUserData = await client.get(cacheUserKey);

    if (cacheUserData) {
      return NextResponse.json({
        user: JSON.parse(cacheUserData),
      });
    }

    // Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: uid },
      include: {
        customLinks: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await client.setex(cacheUserKey, 60 * 60 * 24 * 7, JSON.stringify(user));

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const cookie = (await cookies()).get("session")?.value;

    if (!cookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cacheKey = `session:${cookie}`;

    const cachedData = await client.get(cacheKey);
    let uid: string | undefined;

    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        uid = parsed?.uid;
      } catch (error) {
        console.error(error);
        uid = undefined;
      }
    } else {
      const decoded = await firebaseAdmin
        .auth()
        .verifySessionCookie(cookie, true);

      uid = decoded.uid;

      await client.setex(cacheKey, 60 * 60 * 24 * 7, JSON.stringify({ uid }));
    }

    if (!uid) {
      return NextResponse.json({ message: "UID not Found" }, { status: 401 });
    }

    const cacheSettingKey = `user:${uid}:settings`;
    const cacheKey_Profile = `user:${uid}:profile`;
    const cacheKey_Dashboard = `user:${uid}:dashboard`;
    const cacheAuth = `user:${uid}`;

    await client.del(cacheAuth);
    await client.del(cacheKey_Profile);
    await client.del(cacheSettingKey);
    await client.del(cacheKey_Dashboard);

    const currentUser = await prisma.user.findUnique({ where: { id: uid } });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { tagLine, avatarUrl, location, name, userName, links, socials } =
      body;

    //! IF USERNAME IS CHANGING VALIDATE IT
    if (userName && userName !== currentUser.userName) {
      //! 1. Checking for valid username
      const validation = validateUsername(userName);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      //! 2. Check if username is already taken
      const existingUser = await prisma.user.findUnique({
        where: { userName: userName.toLowerCase() },
      });

      if (existingUser && existingUser.id !== uid) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 },
        );
      }

      //! 3. Check if username is in active history (reserved)
      const activeHistory = await prisma.usernameHistory.findFirst({
        where: {
          oldUserName: userName.toLowerCase(),
          expiresAt: { gte: new Date() },
        },
      });

      if (activeHistory) {
        const daysLeft = Math.ceil(
          (activeHistory.expiresAt.getTime() - Date.now()) /
            (24 * 60 * 60 * 1000),
        );

        return NextResponse.json(
          { error: `Username reserved. Available in ${daysLeft} days.` },
          { status: 400 },
        );
      }

      //! 4. Save old username to history (only if changing)
      await prisma.usernameHistory.create({
        data: {
          oldUserName: currentUser.userName,
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          userId: uid,
        },
      });
    }

    // Upload avatar to Cloudinary if new image provided
    let finalAvatarUrl: string | undefined;

    if (avatarUrl && avatarUrl.startsWith("data:image")) {
      try {
        const uploadedAvatar = await cloudinary.uploader.upload(avatarUrl, {
          folder: "testimonialhub/avatars",
          transformation: [
            { width: 400, height: 400, crop: "fill", gravity: "face" },
            { quality: "auto", fetch_format: "auto" },
          ],
        });
        finalAvatarUrl = uploadedAvatar.secure_url;
      } catch (err) {
        console.error("Avatar upload failed:", err);
        return NextResponse.json(
          { error: "Failed to upload avatar" },
          { status: 500 },
        );
      }
    }

    //! Update user
    const user = await prisma.user.update({
      where: { id: uid },
      data: {
        name: name || currentUser.name,
        tagLine: tagLine || currentUser.tagLine,
        avatarUrl: finalAvatarUrl || currentUser.avatarUrl,
        userName: userName ? userName.toLowerCase() : currentUser.userName,
        location: location || currentUser.location,
        instagram: socials?.instagram || currentUser.instagram,
        linkedin: socials?.linkedin || currentUser.linkedin,
        twitter: socials?.twitter || currentUser.twitter,
        youtube: socials?.youtube || currentUser.youtube,
      },
    });

    let updatedLinks = [];

    //! Update custom links
    if (links && Array.isArray(links) && links.length > 0) {
      await prisma.customLink.deleteMany({
        where: { userId: uid },
      });

      await prisma.customLink.createMany({
        data: links.map((link: any, index: number) => ({
          label: link.label,
          url: link.url,
          order: index,
          userId: uid,
        })),
      });
    }

    updatedLinks = await prisma.customLink.findMany({
      where: {
        userId: uid,
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      message: "Settings updated successfully",
      user: {
        name: user.name,
        tagLine: user.tagLine,
        avatarUrl: user.avatarUrl,
        location: user.location,
      },
      customLinks: updatedLinks,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
