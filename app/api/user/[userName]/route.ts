import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/user/[userName]
export async function GET(req: Request, { params }: { params: { userName: string } }) {
  try {
    const { userName } = params;

    if (!userName) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { userName },
      select: {
        id: true,        // internal ID to link testimonials
        name: true,
        avatarUrl: true,
        userName: true,  // optional, useful for frontend display
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
