import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

async function ChannelIdPage({ params }: ChannelIdPageProps) {
  const profile = await currentProfile();
  if (!profile) auth().redirectToSignIn();
  const channel = await db.channel.findUnique({
    where: { id: params.channelId },
  });

  const member = await db.member.findFirst({
    where: { serverId: params.serverId, profileId: profile?.id },
  });

  if (!channel || !member) {
    redirect("/");
  }
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-screen">
      <div className="fixed top-0 z-10 bg-white dark:bg-[#313338] w-full md:pr-[310px]">
        <ChatHeader
          name={channel.name}
          serverId={channel.serverId}
          type="channel"
        />
      </div>
      <div className="flex-1 z-0 pb-[80px] pt-[80px]">
        <ChatMessages
          member={member}
          name={channel.name}
          chatId={channel.id}
          type="channel"
          apiUrl="/api/messages"
          socketUrl="api/socket/messages"
          socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
          paramKey="channelId"
          paramValue={channel.id}
        />
      </div>
      <div className="fixed bottom-0 z-10 bg-white dark:bg-[#313338] w-full md:pr-[300px]">
        <ChatInput
          name={channel.name}
          type="channel"
          apiUrl="/api/socket/messages"
          query={{ channelId: channel.id, serverId: channel.serverId }}
        />
      </div>
    </div>
  );
}

export default ChannelIdPage;
