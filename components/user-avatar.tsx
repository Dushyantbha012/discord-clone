import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "./ui/avatar";

interface UserAvtarProps {
  src?: string;
  className?: string;
}

function UserAvatar({ src, className }: UserAvtarProps) {
  return (
    <Avatar className={cn("h-7 w-7 md:w-10 md:h-10 mr-2", className)}>
      <AvatarImage src={src} />
    </Avatar>
  );
}

export default UserAvatar;
