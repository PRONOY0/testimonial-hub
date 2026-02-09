//!* Dashboard or private dashboard for the user/freelancer
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { firebaseAdmin } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];

    const decoded = await firebaseAdmin.auth().verifyIdToken(token);

    const { uid } = decoded;

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

    return NextResponse.json({
      user: {
        id: userExist.id,
        name: userExist.name,
        email: userExist.email,
        userName: userExist.userName,
        avatarUrl: userExist.avatarUrl,
      },
      stats: {
        totalTestimonials,
        verifiedCount,
        avgRating: Number(avgRating.toFixed(1)),
      },
      testimonials,
    });
  } catch (error) {
    console.error("Auth sync error: at /me", error);

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
