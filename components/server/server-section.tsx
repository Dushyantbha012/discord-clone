"use client";

import { ChannelType, MemberRole, Server } from "@prisma/client";
import { ActionTooltip } from "../ui/action-tooltip";
import { Plus, Settings2 } from "lucide-react";
import { useModal } from "../hooks/use-modal-store";
import { redirect } from "next/navigation";
import ServerChannel from "./server-channel";
import { Separator } from "../ui/separator";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server: any;
}

function ServerSection({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) {
  const { onOpen } = useModal();

  if (!server) return redirect("/");
  const textChannels = server?.channels.filter(
    (channel: { type: string }) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server?.channels.filter(
    (channel: { type: string }) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (channel: { type: string }) => channel.type === ChannelType.VIDEO
  );
  const members = server?.members;
  return (
    <div className="flex items-center justify-between py-2 flex-row flex-wrap">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() => {
              onOpen("createChannel", { server, channelType });
            }}
          >
            <Plus className="h-4 w-4"></Plus>
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() => {
              onOpen("members", { server });
            }}
          >
            <Settings2 className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
}

export default ServerSection;
