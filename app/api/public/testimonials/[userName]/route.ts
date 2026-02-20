import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userName: string }> },
) {
  try {
    const { userName } = await params;

    if (!userName) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400, headers: corsHeaders() },
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
        { status: 404, headers: corsHeaders() },
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
      (t) => t.isVerifiedByOwner,
    ).length;

    // Return clean API response with CORS headers
    return NextResponse.json(
      {
        user: {
          name: user.name,
          userName: user.userName,
          avatarUrl: user.avatarUrl,
          tagLine: user.tagLine,
          location: user.location,
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
      },
      { headers: corsHeaders() },
    );
  } catch (error) {
    console.error("Public API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders() },
    );
  }
}

// CORS headers helper
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*", // Allow all origins
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

// Handle OPTIONS request (preflight)
export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders(),
  });
}
