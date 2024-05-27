"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import qs from "query-string";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

import { useModal } from "@/components/hooks/use-modal-store";
import axios from "axios";
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../user-avatar";
import { useState } from "react";

import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { MemberRole } from "@prisma/client";
import { useRouter } from "next/navigation";

export const MembersModal = () => {
  const roleIconMap = {
    GUEST: null,
    MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
  };
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  //@ts-ignore
  const { server } = data;
  const [loadingId, setLoadingId] = useState("");
  const isModalOpen = isOpen && type === "members";

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: { serverId: server?.id },
      });

      const response = await axios.delete(url);
      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.log(error);
    }
  };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: { serverId: server?.id },
      });
      const response = await axios.patch(url, { role });
      onOpen("members", { server: response.data });
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white text-black overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
              Manage Members
            </DialogTitle>

            <DialogDescription className="text-center text-zinc-500">
              {server?.members?.length} Members
            </DialogDescription>
          </DialogHeader>
          <ScrollArea>
            {server?.members?.map(
              (member: {
                profileId: string;
                id: string | null | undefined;
                profile: {
                  imageUrl: string | undefined;
                  name: string;
                  email: string;
                };
                role: "ADMIN" | "GUEST" | "MODERATOR";
              }) => {
                return (
                  <div
                    key={member.id}
                    className="flex items-center gapx-2 mb-6"
                  >
                    <UserAvatar src={member.profile.imageUrl} />
                    <div className="flex flex-col gap-y-1">
                      <div className="text-xs font-semibold flex items-center gap-x-1">
                        {member.profile.name}

                        {roleIconMap[member.role]}
                      </div>
                      <p className="text-xs text-zinc-500">
                        {member.profile.email}
                      </p>
                    </div>
                    {server.profileId !== member.profileId &&
                      loadingId !== member.id && (
                        <div className="ml-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <MoreVertical className="h-4 w-4 text-zinc-500" />
                              <DropdownMenuContent side="right">
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger className="flex items-center">
                                    <ShieldQuestion className="h-4 w-4 mr-2" />
                                    <span>Role</span>
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          onRoleChange(member.id!, "GUEST")
                                        }
                                      >
                                        <Shield className="h-4 w-4 mr-2" />
                                        Guest
                                        {member.role === "GUEST" && (
                                          <Check className="h-4 w-4 ml-auto" />
                                        )}
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          onRoleChange(member.id!, "MODERATOR")
                                        }
                                      >
                                        <Shield className="h-4 w-4 mr-2" />
                                        Moderator
                                        {member.role === "MODERATOR" && (
                                          <Check className="h-4 w-4 ml-auto" />
                                        )}
                                      </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                  </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => onKick(member.id!)}
                                  className=" hover:text-rose-500"
                                >
                                  Kick
                                  <Gavel className="h-4 w-4 mr-2 ml-2" />
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenuTrigger>
                          </DropdownMenu>
                          {loadingId === member?.id && (
                            <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
                          )}
                        </div>
                      )}
                  </div>
                );
              }
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};
