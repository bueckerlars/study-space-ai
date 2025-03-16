import {useLocation } from "react-router-dom";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { Label } from "./ui/label";
import { ToggleThemeButton } from "./ToggleThemeButton";
import UserAvatarDropdown from "./UserAvatarDropdown";

const AppHeader = () => {
    const { state } = useSidebar();

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
        <div className="flex-1" />
        <ToggleThemeButton />
        <div className="mx-1" />
        <UserAvatarDropdown />
      </div>
    );
  };

  export default AppHeader;