import { User } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CircleUserRound } from "lucide-react";

type UserAvatarProps = {
  user: User | null;
};

function UserAvatar({ user }: UserAvatarProps) {
  return (
    <Avatar>
      {user && user.userImageUrl ? (
        <AvatarImage src={user?.userImageUrl} />
      ) : (
        <AvatarImage src="https://github.com/shadcn.png" />

        // <CircleUserRound />
      )}
      <AvatarFallback>{user?.userEmail?.charAt(0)}</AvatarFallback>
    </Avatar>
  );
}
export default UserAvatar;
