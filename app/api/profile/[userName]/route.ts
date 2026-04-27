import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import client from "../../client";
import { cookies } from "next/headers";
import { firebaseAdmin } from "@/lib/firebase-admin";

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

    const session = (await cookies()).get("session")?.value;

    if (!session) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    const sessionCacheKey = `session:${session}`;
    const cachedSession = await client.get(sessionCacheKey);
    let uid: string | undefined;

    if (cachedSession) {
      try {
        const parsed = JSON.parse(cachedSession);

        uid = parsed?.uid;
      } catch (error) {
        console.log(error);
        uid = undefined;
      }
    } else {
      const decoded = await firebaseAdmin
        .auth()
        .verifySessionCookie(session!, true);

      uid = decoded.uid;

      await client.setex(sessionCacheKey, 60 * 60 * 24 * 7, JSON.stringify({ uid }));
    }

    const userCacheKey = `user:${uid}:profile`;

    const userCachedData = await client.get(userCacheKey);

    if (userCachedData) {
      return NextResponse.json(JSON.parse(userCachedData));
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

    const responseData = {
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
        avgRating: avgRating ? parseFloat(avgRating.toFixed(1)) : 0,
        verifiedCount: verifiedCount,
      },
      customLinks: user.customLinks,
      socials: {
        instagram: user.instagram,
        twitter: user.twitter,
        linkedin: user.linkedin,
        youtube: user.youtube,
      },
    };

    await client.setex(
      userCacheKey,
      60 * 60 * 24 * 7,
      JSON.stringify(responseData),
    );

    //! Return to frontend
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
