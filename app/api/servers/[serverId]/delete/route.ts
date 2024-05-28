import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.serverId) {
      return new NextResponse("Server Id missing", { status: 400 });
    }
    const server = await db.server.deleteMany({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
    });
    return NextResponse.json({ server });
  } catch (error) {
    console.log("[SERVER_ID_LEAVE] \n", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
