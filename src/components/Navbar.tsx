import { SearchIcon, X, AlignJustify } from "lucide-react";
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
      setUser(null);
      localStorage.removeItem("user");

      navigate("/", { replace: true });
    },
  });

  return (
    <div className=" py-6 my-2 border-b-[1px] border-gray-300 sticky top-0 z-50 bg-white">
      <div className="flex items-center max-w-[80%] mx-auto ">
        <div className="cursor-pointer">
          <Avatar>
            {/* TODO - remember to upload logo image on a website and reference the url here */}
            <AvatarImage
              className="bg-transparent"
              onClick={() => navigate("/food-list")}
              src={logo}
            />
            <AvatarFallback>HC</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1">
          <form className="flex items-center mx-auto space-x-1 bg-white p-4 border-[1px] border-gray-300 shadow-md rounded-full flex-1 max-w-[80%]">
            <SearchIcon className="h-4 text-gray-600" />
            <input
              className="bg-transparent flex-1 outline-none"
              type="text"
              placeholder="Search"
            />
          </form>
        </div>

        <div className="flex items-center space-x-2 border-[1px] border-gray-300 p-2  rounded-full shadow-md">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none flex items-center space-x-2">
              {<UserAvatar user={user} />}
              <AlignJustify className="text-gray-500 " />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-2">
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
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
