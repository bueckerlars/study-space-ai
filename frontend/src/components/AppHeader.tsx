import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { Label } from "./ui/label";
import { ToggleThemeButton } from "./ToggleThemeButton";
import UserAvatarDropdown from "./UserAvatarDropdown";
import { useHeader } from "../provider/HeaderProvider";

const AppHeader = () => {
    const { state } = useSidebar();
    const { title } = useHeader();
    
    return (
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background/95 px-4 py-3 backdrop-blur">
        {state === "collapsed" && (
            <SidebarTrigger />
        )}
  
        <Label className="text-xl font-bold">{title}</Label>
        <div className="flex-1" />
        <ToggleThemeButton />
        <div className="mx-1" />
        <UserAvatarDropdown />
      </div>
    );
  };

  export default AppHeader;