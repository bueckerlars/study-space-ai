import { useAuth } from "@/provider/AuthProvider";
import { Link, useLocation } from "react-router-dom";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { Label } from "./ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SettingsIcon, LogOutIcon } from "lucide-react";
import { ToggleThemeButton } from "./ToggleThemeButton";

const AppHeader = () => {
    const { state } = useSidebar();
    const { logout, user } = useAuth();

    const location = useLocation();
    const getTitleFromPath = (path: string) => {
        if (path === "/app") {
            return "Dashboard";
        }
        return path.replace("/", "").charAt(0).toUpperCase() + path.slice(2);
    };

    const pageTitle = getTitleFromPath(location.pathname);
    
    return (
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background/95 px-4 py-3 backdrop-blur">
        {state === "collapsed" && (
            <SidebarTrigger />
        )}
  
        <Label className="text-xl font-bold">{pageTitle}</Label>
        
        {/* Flexibler Zwischenraum */}
        <div className="flex-1" />

        {/* Theme wechseln */}
        <ToggleThemeButton />

        {/* Flexibler Zwischenraum */}
        <div className="mx-1" />

        {/* User Avatar mit Dropdown */}
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
      </div>
    );
  };

  export default AppHeader;