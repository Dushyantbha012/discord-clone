import { db } from "@/lib/db";
import { currentProfile } from "@/lib/currentProfile";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorised User", { status: 401 });
    }

    const updatedProfile = await db.profile.update({
      where: {
        id: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });
    const names = name.split(" ");
    const params = {
      firstName: names[0] ? names[0] : "",
      lastName: names[1] ? names[1] : "",
      imageUrl: imageUrl ? imageUrl : "",
    };
    await clerkClient.users.updateUser(profile?.userId, params);

    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    console.log("[Profile Post] ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
