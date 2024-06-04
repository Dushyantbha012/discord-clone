import { initialProfile } from "@/lib/initial-profile";
import { currentUser, auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { InitialModal } from "@/components/modals/initial-modal";
import { ProfileModal } from "@/components/modals/profile-modal";

async function SetupPage() {
  const profile = await initialProfile();
  const user = await currentUser();

  if (
    profile?.name === "null null" ||
    (user?.firstName === null && user?.lastName === null)
  ) {
    return <ProfileModal userId={profile.userId} />;
  }
  const server = await db.server.findFirst({
    where: { members: { some: { profileId: profile?.id } } },
  });
  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <InitialModal />;
}

export default SetupPage;
