/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { firebaseAdmin } from "@/lib/firebase-admin";
import cloudinary from "@/lib/cloudinary";

// GET /api/user/[userName]
export async function GET(req: Request) {
  try {
    const cookie = (await cookies()).get("session")?.value;

    if (!cookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await firebaseAdmin
      .auth()
      .verifySessionCookie(cookie, true);

    const { uid } = decoded;

    // Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: uid },
      select: {
        id: true,
        tagLine: true,
        customUrl: true,
        location: true,
        name: true,
        avatarUrl: true,
        userName: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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

    const decoded = await firebaseAdmin
      .auth()
      .verifySessionCookie(cookie, true);

    const { uid } = decoded;

    const body = await req.json();
    const { tagLine, customUrl, avatarUrl, location, name, userName } = body;

    // Validate URL if provided
    if (customUrl && customUrl.trim() !== "") {
      try {
        new URL(customUrl);
      } catch {
        return NextResponse.json(
          { error: "Invalid URL format" },
          { status: 400 },
        );
      }
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

    const checkUserNameExist = await prisma.user.findUnique({
      where: { userName: userName },
    });

    if (checkUserNameExist && checkUserNameExist.id !== uid) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 },
      );
    }

    const userExist = await prisma.user.findUnique({ where: { id: uid } });

    if (!userExist) {
      return NextResponse.json(
        {},
        { status: 404, statusText: "User Doesn't Exist" },
      );
    }

    // Update user
    const user = await prisma.user.update({
      where: { id: uid },
      data: {
        name: name || userExist.name,
        customUrl: customUrl || userExist.customUrl,
        tagLine: tagLine || userExist.tagLine,
        avatarUrl: finalAvatarUrl || userExist.avatarUrl,
        userName: userName || userExist.userName,
        location: location || userExist.location,
      },
    });

    return NextResponse.json({
      message: "Settings updated successfully",
      user: {
        name: user.name,
        tagLine: user.tagLine,
        customUrl: user.customUrl,
        avatarUrl: user.avatarUrl,
        location: user.location,
      },
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.error("Error updating user settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
