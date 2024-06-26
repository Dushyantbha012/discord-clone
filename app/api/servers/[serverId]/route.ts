import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    const { name, imageUrl } = await req.json();
    if (!profile) return new NextResponse("Unauthorised", { status: 401 });
    if (!params.serverId) {
      return new NextResponse("Server Id Missing", { status: 400 });
    }
    const server = await db.server.update({
      where: { id: params.serverId, profileId: profile.id },
      data: { name, imageUrl },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER ID PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
