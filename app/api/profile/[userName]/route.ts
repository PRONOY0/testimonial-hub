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
        { status: 400 },
      );
    }

    //! Find the user by userName
    const user = await prisma.user.findUnique({
      where: { userName },
    });

    if (!user || user.userName !== userName) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    //! Fetch all verified testimonials for this user
    const testimonials = await prisma.testimonial.findMany({
      where: {
        userId: user.id,
        isVerifiedByOwner: true,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        company: true,
        avatarUrl: true,
        feedback: true,
        stars: true,
        audioUrl: true,
        socialType: true,
        socialLink: true,
        isVerifiedByOwner: true,
        createdAt: true,
      },
    });

    //! Calculate average rating
    const totalStars = testimonials.reduce((acc, t) => acc + t.stars, 0);
    const avgRating =
      testimonials.length > 0 ? totalStars / testimonials.length : 0;

    const verifiedCount = testimonials.filter(
      (t) => t.isVerifiedByOwner,
    ).length;

    const customLinks = await prisma.customLink.findMany({
      where: { userId: user.id },
    });

    //! Return to frontend
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        userName: user.userName,
        tagLine: user.tagLine,
        avatarUrl: user.avatarUrl,
        location: user.location,
        createdAt: user.createdAt,
      },
      testimonials,
      totalTestimonials: testimonials.length,
      avgRating: parseFloat(avgRating.toFixed(1)),
      verifiedCount: verifiedCount,
      customLinks: customLinks,
      socials: {
        instagram: user.instagram,
        twitter: user.twitter,
        linkedin: user.linkedin,
        youtube: user.youtube,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
