//!* Dashboard or private dashboard for the user/freelancer
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { firebaseAdmin } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import client from "../../client";

export async function GET(req: Request) {
  try {
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

      await client.setex(
        sessionCacheKey,
        60 * 60 * 24 * 7,
        JSON.stringify({ uid }),
      );
    }

    const cacheKey = `user:${uid}:dashboard`;

    console.log(cacheKey);

    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData));
    }

    if (!uid) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const userExist = await prisma.user.findUnique({
      where: { id: uid },
    });

    if (!userExist) {
      return NextResponse.json(
        { error: "User doesn't exist" },
        { status: 404 },
      );
    }

    const testimonials = await prisma.testimonial.findMany({
      where: { userId: userExist.id },
      orderBy: { createdAt: "desc" },
    });

    const totalTestimonials = testimonials.length;

    const totalStars = testimonials.reduce((sum, t) => sum + t.stars, 0);

    const avgRating =
      totalTestimonials > 0 ? totalStars / totalTestimonials : 0;

    const verifiedCount = testimonials.filter(
      (t) => t.isVerifiedByOwner,
    ).length;

    const responseData = {
      user: {
        id: userExist.id,
        name: userExist.name,
        // email: userExist.email,
        userName: userExist.userName,
        // location: userExist.location,
        avatarUrl: userExist.avatarUrl,
      },
      stats: {
        totalTestimonials,
        verifiedCount,
        avgRating: Number(avgRating.toFixed(1)),
      },
      testimonials: testimonials,
    };

    await client.setex(
      cacheKey,
      60 * 60 * 24 * 7,
      JSON.stringify(responseData),
    );

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("GET /api/testimonial/me", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
