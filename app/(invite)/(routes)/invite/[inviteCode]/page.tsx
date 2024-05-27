import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface inviteCodePageProps {
  params: { inviteCode: string };
}

const InviteCodePage = async ({ params }: inviteCodePageProps) => {
  const profile = await currentProfile();
  if (!profile) return auth().redirectToSignIn();
  if (!params) return redirect("/");
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: { some: { profileId: profile.id } },
    },
  });
  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }
  const server = await db.server.update({
    where: { inviteCode: params.inviteCode },
    data: { members: { create: { profileId: profile.id } } },
  });
  if (server) return redirect(`/servers/${server.id}`);
  else return redirect("/");
};
export default InviteCodePage;
