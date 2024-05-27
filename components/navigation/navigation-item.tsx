"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/ui/action-tooltip";

interface NavigationItemProps {
  id: String;
  imageUrl: string;
  name: string;
}

export const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();
  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button
        onClick={() => {
          router.replace(`/servers/${id}`);
        }}
        className="group relative flex items-center mt-6"
      >
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-full group-hover:rounded-[16px] transition-all overflow-hidden ",
            params?.serverId === id &&
              "bg/primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image src={imageUrl} alt="Channel" height="48" width="48" />
        </div>
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[48px]" : "h-[16px]"
          )}
        ></div>
      </button>
    </ActionTooltip>
  );
};
