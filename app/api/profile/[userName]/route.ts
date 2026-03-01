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

    //! Find the user by userName in user model
    let user = await prisma.user.findUnique({
      where: { userName: userName.toLowerCase() },
      include: {
        testimonials: { orderBy: { createdAt: "desc" } },
        customLinks: { orderBy: { order: "asc" } },
      },
    });

    //! Find the user by userName in oldUserName model

    if (!user) {
      const history = await prisma.usernameHistory.findFirst({
        where: {
          oldUserName: userName.toLowerCase(),
          expiresAt: { gte: new Date() },
        },
        include: {
          user: {
            include: {
              testimonials: { orderBy: { createdAt: "desc" } },
              customLinks: { orderBy: { order: "asc" } },
            },
          },
        },
      });

      if (history) {
        user = history.user;
      }
    }

    //! user doesn't exist in both of the models return 404

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    //! Calculate average rating
    const totalTestimonials = user.testimonials.length;
    const totalStars = user.testimonials.reduce((acc, t) => acc + t.stars, 0);
    const avgRating =
      totalTestimonials > 0 ? totalStars / totalTestimonials : 0;

    const verifiedCount = user.testimonials.filter(
      (t) => t.isVerifiedByOwner,
    ).length;

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
      testimonials: user.testimonials,
      stats: {
        totalTestimonials: totalTestimonials,
        avgRating: parseFloat(avgRating.toFixed(1)),
        verifiedCount: verifiedCount,
      },
      customLinks: user.customLinks,
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
