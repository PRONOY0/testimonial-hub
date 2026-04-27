import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import client from "../../client";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userName: string }> },
) {
  try {
    const { userName } = await params;

    if (!userName) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 },
      );
    }

    let pageOwner = await prisma.user.findUnique({
      where: { userName: userName.toLowerCase() },
    });

    if (!pageOwner) {
      const history = await prisma.usernameHistory.findFirst({
        where: {
          oldUserName: userName.toLowerCase(),
          expiresAt: { gte: new Date() },
        },
        include: {
          user: true,
        },
      });

      if (history) {
        pageOwner = history.user;
      }
    }

    if (!pageOwner) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const cacheKey_Profile = `user:${pageOwner.id}:profile`;
    const cacheKey_Dashboard = `user:${pageOwner.id}:dashboard`;

    await client.del(cacheKey_Profile);
    await client.del(cacheKey_Dashboard);

    const body = await req.json();
    const {
      name,
      feedback,
      stars,
      socialType,
      socialLink,
      audioUrl, // blob URL from frontend (useless)
      avatarUrl, // base64 string from frontend (too big)
      company,
    } = body;

    if (!name || !feedback || !stars || !socialType || !socialLink) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (stars < 1 || stars > 5) {
      return NextResponse.json(
        { error: "Stars must be between 1 and 5" },
        { status: 400 },
      );
    }

    // Upload avatar to Cloudinary if it's a base64 string
    let finalAvatarUrl = `https://api.dicebear.com/9.x/open-peeps/svg?seed=${encodeURIComponent(name)}`;

    if (avatarUrl && avatarUrl.startsWith("data:image")) {
      try {
        const uploadedAvatar = await cloudinary.uploader.upload(avatarUrl, {
          folder: "testimonialhub/avatars",
          transformation: [
            { width: 200, height: 200, crop: "fill", gravity: "face" },
            { quality: "auto", fetch_format: "auto" },
          ],
        });
        finalAvatarUrl = uploadedAvatar.secure_url;
      } catch (err) {
        console.error("Avatar upload failed:", err);
        // fallback to dicebear (already set above)
      }
    }

    // Upload audio to Cloudinary if it exists
    // But blob URLs can't be uploaded from backend (they're browser-only)
    // So frontend needs to send base64 audio instead (see frontend fix below)
    let finalAudioUrl = null;

    if (audioUrl && audioUrl.startsWith("data:audio")) {
      try {
        const uploadedAudio = await cloudinary.uploader.upload(audioUrl, {
          folder: "testimonialhub/audio",
          resource_type: "video", // Cloudinary uses "video" for audio files
        });
        finalAudioUrl = uploadedAudio.secure_url;
      } catch (err) {
        console.error("Audio upload failed:", err);
        finalAudioUrl = null;
      }
    }

    const isVerifiedByOwner =
      !!socialLink && ["linkedin", "twitter", "instagram"].includes(socialType);

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        company: company ?? null,
        avatarUrl: finalAvatarUrl,
        feedback,
        stars,
        audioUrl: finalAudioUrl,
        socialType,
        socialLink,
        userId: pageOwner.id,
        isVerifiedByOwner,
      },
    });

    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
