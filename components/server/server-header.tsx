"use client";
import { MemberRole } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  PlusCircle,
  Settings,
  Trash,
  Trash2,
  LogOut,
  UserPlus2,
  Users2,
} from "lucide-react";
import { useModal } from "../hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/tyes";

interface serverHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

export const ServerHeader = ({ server, role }: serverHeaderProps) => {
  const { onOpen } = useModal();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none" asChild>
          <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
            {server.name}
            <ChevronDown className="h-5 w-5 ml-auto" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
          {isModerator && (
            <DropdownMenuItem
              className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer dark:hover:text-indigo-500"
              onClick={() => {
                onOpen("invite", { server });
              }}
            >
              Invite People <UserPlus2 className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => {
                onOpen("editServer", { server });
              }}
              className="px-3 py-2 text-sm cursor-pointer"
            >
              Server Settings <Settings className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem
              className="px-3 py-2 text-sm cursor-pointer"
              onClick={() => {
                onOpen("members", { server });
              }}
            >
              Manage Members <Users2 className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isModerator && (
            <DropdownMenuItem
              className="px-3 py-2 text-sm cursor-pointer"
              onClick={() => {
                onOpen("createChannel", { server });
              }}
            >
              Create Channel <PlusCircle className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isModerator && <DropdownMenuSeparator />}
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => {
                onOpen("deleteServer", { server });
              }}
              className="px-3 py-2 text-sm cursor-pointer text-red-500"
            >
              Delete Server <Trash2 className="h-4 w-4 ml-auto " />
            </DropdownMenuItem>
          )}
          {!isAdmin && (
            <DropdownMenuItem
              className="px-3 py-2 text-sm cursor-pointer text-red-500"
              onClick={() => {
                onOpen("leaveServer", { server });
              }}
            >
              Leave Server <LogOut className="h-4 w-4 ml-auto " />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
