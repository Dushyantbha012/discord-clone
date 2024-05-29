"use client";

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit2, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams } from "next/navigation";
import { ActionTooltip } from "../ui/action-tooltip";
import { useModal } from "../hooks/use-modal-store";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: (
    <Hash className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
  ),
  [ChannelType.AUDIO]: (
    <Mic className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
  ),
  [ChannelType.VIDEO]: (
    <Video className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
  ),
};
function ServerChannel({ channel, server, role }: ServerChannelProps) {
  const params = useParams();
  const { onOpen } = useModal();
  const Icon = iconMap[channel.type];
  return (
    <div className="w-full flex flex-row">
      <button
        onClick={() => {}}
        className={cn(
          "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
          params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
        )}
      >
        {Icon}
        <p
          className={cn(
            "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
            params?.channelId === channel.id &&
              "text-primary dark:text-zinc-200 dark:group-hover:text-white"
          )}
        >
          {channel.name}
        </p>
        {channel.name !== "general" && role !== MemberRole.GUEST && (
          <div className="ml-auto flex items-center gap-x-2">
            <ActionTooltip label="Edit">
              <Edit2 className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:tet-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" />
            </ActionTooltip>

            <ActionTooltip label="Delete">
              <Trash
                onClick={() => {
                  onOpen("deleteChannel", { server, channel });
                }}
                className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:tet-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          </div>
        )}
        {channel.name === "general" && (
          <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        )}
      </button>
    </div>
  );
}

export default ServerChannel;
