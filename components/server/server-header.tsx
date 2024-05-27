"use client";

import { ServerWithMembersWithProfiles } from "@/tyes";
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
  Settings2,
  Trash2,
  UserPlus,
  UserPlus2,
  Users,
  Users2,
} from "lucide-react";

interface serverHeaderProps {
  server: any;
  role?: MemberRole;
}

export const ServerHeader = ({ server, role }: serverHeaderProps) => {
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
            <DropdownMenuItem className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer dark:hover:text-indigo-500">
              Invite People <UserPlus2 className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer">
              Server Settings <Settings className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer">
              Manage Members <Users2 className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isModerator && (
            <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer">
              Create Channel <PlusCircle className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isModerator && <DropdownMenuSeparator />}
          {isAdmin && (
            <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer text-red-500">
              Delete Server <Trash2 className="h-4 w-4 ml-auto " />
            </DropdownMenuItem>
          )}
          {!isAdmin && (
            <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer text-red-500">
              Leave Server <Trash2 className="h-4 w-4 ml-auto " />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
