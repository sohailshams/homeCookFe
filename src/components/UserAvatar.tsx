import { User } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

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
      )}
      <AvatarFallback>{user?.userEmail?.charAt(0)}</AvatarFallback>
    </Avatar>
  );
}
export default UserAvatar;
