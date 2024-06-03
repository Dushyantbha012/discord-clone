"use client";

import qs from "query-string";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Video, VideoOff } from "lucide-react";
import { ActionTooltip } from "../ui/action-tooltip";

export const ChatVideoButton = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const isVideo = searchParams?.get("video");

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    );
    router.push(url);
  };
  const icon = isVideo ? (
    <VideoOff className="h-6 w-6 dark:text-zinc-400" />
  ) : (
    <Video className="h-6 w-6 dark:text-zinc-400" />
  );
  const tooltipLabel = isVideo ? "End Video call" : "Start Video Call";
  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button onClick={onClick} className="hover:opacity-75 transition mr-4">
        {icon}
      </button>
    </ActionTooltip>
  );
};
