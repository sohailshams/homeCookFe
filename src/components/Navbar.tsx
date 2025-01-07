import { SearchIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import UserAvatar from "./UserAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "@/api/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import logo from "../assets/hc-logo.png";

const Navbar: React.FC = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { mutate: logoutMutation } = useMutation({
    mutationFn: logoutUser,
    onError: () => {
      toast.error("Something went wrong, please try again to logout.", {
        duration: Infinity,
        action: {
          label: <X />,
          onClick: () => toast.dismiss(),
        },
        id: "logout-fail-toast",
      });
    },

    onSuccess: async () => {
      console.log("onSuccess");
      setUser(null);
      localStorage.removeItem("user");

      navigate("/", { replace: true });
    },
  });

  return (
    <div className="flex items-center p-2 max-w-6xl mx-auto">
      <div className="flex items-center space-x-4 cursor-pointer">
        <Avatar>
          {/* TODO - remember to upload logo image on a website and reference the url here */}
          <AvatarImage onClick={() => navigate("/food-list")} src={logo} />
          <AvatarFallback>HC</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1">
        <form className="flex items-center space-x-1 bg-gray-100 p-2 rounded-md flex-1 mx-2 max-w-96">
          <SearchIcon className="h-4 text-gray-600" />
          <input
            className="bg-transparent flex-1 outline-none"
            type="text"
            placeholder="Search"
          />
        </form>
      </div>

      <div className="flex items-center space-x-4 px-6">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            {<UserAvatar user={user} />}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator />
            {user ? (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  logoutMutation();
                }}
              >
                Logout
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="cursor-pointer">
                Login
              </DropdownMenuItem>
            )}

            <DropdownMenuItem className="cursor-pointer">
              Register
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>{" "}
        <Button asChild variant="outline"></Button>
      </div>
    </div>
  );
};
export default Navbar;
