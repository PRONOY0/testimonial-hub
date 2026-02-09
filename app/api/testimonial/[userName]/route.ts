import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/testimonial/[userName]
export async function POST(
  req: Request,
  { params }: { params: { userName: string } },
) {
  try {
    const { userName } = params;
    if (!userName) {
      return NextResponse.json(
        { error: "Username is required in URL" },
        { status: 400 },
      );
    }

    const body = await req.json();

    const {
      userId,
      name,
      feedback,
      stars,
      socialType,
      socialLink,
      audioUrl,
      avatarUrl,
      company,
    } = body;

    //* Validate required fields
    if (!userId || !name || !feedback || !stars || !socialType || !socialLink) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate stars range
    if (stars < 1 || stars > 5) {
      return NextResponse.json(
        { error: "Stars must be between 1 and 5" },
        { status: 400 },
      );
    }

    //! Verify userId exists and matches the userName
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.userName !== userName) {
      return NextResponse.json({ error: "Invalid user" }, { status: 404 });
    }

    const finalAvatarUrl =
      avatarUrl ||
      `https://api.dicebear.com/9.x/open-peeps/svg?seed=${encodeURIComponent(
        name,
      )}`;

    const isVerifiedByOwner =
      !!socialLink && ["linkedin", "twitter", "instagram"].includes(socialType);

    //! Create testimonial
    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        company: company ?? null,
        avatarUrl: finalAvatarUrl,
        feedback,
        stars,
        audioUrl: audioUrl ?? null,
        socialType,
        socialLink,
        userId,
        isVerifiedByOwner,// auto
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
