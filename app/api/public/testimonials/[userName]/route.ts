import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { userName: string } }
) {
  try {
    const { userName } = await params;

    if (!userName) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { userName },
      include: {
        testimonials: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Calculate stats
    const totalTestimonials = user.testimonials.length;
    const avgRating =
      totalTestimonials > 0
        ? user.testimonials.reduce((sum, t) => sum + t.stars, 0) /
          totalTestimonials
        : 0;
    const verifiedCount = user.testimonials.filter(
      (t) => t.isVerifiedByOwner
    ).length;

    // Return clean API response
    return NextResponse.json({
      user: {
        name: user.name,
        userName: user.userName,
        avatarUrl: user.avatarUrl,
        tagLine: user.tagLine,
        customUrl: user.customUrl,
      },
      stats: {
        totalTestimonials,
        averageRating: Math.round(avgRating * 10) / 10,
        verifiedCount,
      },
      testimonials: user.testimonials.map((t) => ({
        id: t.id,
        name: t.name,
        company: t.company,
        avatarUrl: t.avatarUrl,
        feedback: t.feedback,
        stars: t.stars,
        audioUrl: t.audioUrl,
        socialType: t.socialType,
        socialLink: t.socialLink,
        isVerified: t.isVerifiedByOwner,
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    console.error("Public API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
// GET https://testimonialhub.com/api/public/testimonials/pronoyroy