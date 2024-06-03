import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
}

async function MemberIdPage({ params }: MemberIdPageProps) {
  const profile = await currentProfile();
  if (!profile) return auth().redirectToSignIn();

  const currentMember = await db.member.findFirst({
    where: { serverId: params.serverId, profileId: profile.id },
    include: { profile: true },
  });
  if (!currentMember) return redirect("/");

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );
  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;
  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-screen">
      <div className="fixed top-0 z-10 bg-white dark:bg-[#313338] w-full md:pr-[310px]">
        <ChatHeader
          imageUrl={otherMember.profile.imageUrl}
          name={otherMember.profile.name}
          serverId={params.serverId}
          type="conversation"
        />
      </div>
      <div className="flex-1 z-0 pb-[80px] pt-[80px]">
        <ChatMessages
          member={currentMember}
          name={otherMember.profile.name}
          chatId={conversation.id}
          type="conversation"
          apiUrl="/api/direct-messages"
          socketUrl="api/socket/direct-messages"
          socketQuery={{ conversationId: conversation.id }}
          paramKey="conversationId"
          paramValue={conversation.id}
        />
      </div>
      <div className="fixed bottom-0 z-10 bg-white dark:bg-[#313338] w-full md:pr-[300px]">
        <ChatInput
          name={otherMember.profile.name}
          type="conversation"
          apiUrl="/api/socket/direct-messages"
          query={{ conversationId: conversation.id }}
        />
      </div>
    </div>
  );
}

export default MemberIdPage;
