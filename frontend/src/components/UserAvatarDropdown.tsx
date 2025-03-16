import { SettingsIcon, LogOutIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useAuth } from "@/provider/AuthProvider";

const UserAvatarDropdown = () => {
    const { logout, user } = useAuth();

    return (
        <DropdownMenu>
          <DropdownMenuTrigger className="focus-visible:outline-none">
            <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage src="/default-avatar.png" alt="User Menu" />
              <AvatarFallback>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user?.username}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex w-full cursor-pointer">
                <SettingsIcon className="mr-2 size-4" />
                <span>Einstellungen</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
              <LogOutIcon className="mr-2 size-4" />
              <span>Ausloggen</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default UserAvatarDropdown;