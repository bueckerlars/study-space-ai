import React, { useState } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import FileTypeIcon from "../FileTypeIcon";
import { Checkbox } from "../ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { deleteSourceRequest } from "@/services/ApiService";
import { useAuth } from "@/provider/AuthProvider";

interface SourceTableEntryProps {
    fileName: string;
    sourceId: string;
    fileType: string;
    isCollapsed: boolean;
    onDropdownOpenChange?: (open: boolean) => void;
}

const SourceTableEntry: React.FC<SourceTableEntryProps> = ({ fileName, sourceId, fileType, isCollapsed, onDropdownOpenChange }) => {
    const { authToken } = useAuth();
    const [isHovered, setIsHovered] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleRemove = () => {
        deleteSourceRequest(authToken!, sourceId);
    };

    if (isCollapsed) {
        return (
            <div className="items-center">
                <Button variant={"ghost"} className="h-10 w-10 px-2 rounded-full">
                    <FileTypeIcon type={fileType} />
                </Button>
            </div>
        );
    }

    if (!isCollapsed) {
        return (
            <div 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => { 
                    if (!dropdownOpen) { 
                        setIsHovered(false); 
                        if(onDropdownOpenChange) onDropdownOpenChange(false); 
                    }
                }}
                className={`flex flex-row justify-between rounded-full mt-2 pl-2 pr-4 py-1 w-full items-center min-h-12 ${ (isHovered || dropdownOpen) ? "bg-accent" : "" }`}
            >
                <div className="flex flex-row justify-start items-center">
                    <div className="mr-2 min-w-10">
                        { (isHovered || dropdownOpen) ? (
                            <DropdownMenu onOpenChange={(open) => { 
                                setDropdownOpen(open); 
                                if(onDropdownOpenChange) onDropdownOpenChange(open);
                            }}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem variant="destructive" onClick={handleRemove}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Remove
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="p-2">
                                <FileTypeIcon type={fileType} />
                            </div>
                        )}
                    </div>
    
                    <p className="max-w-[240px] truncate">
                        <span>{typeof fileName === 'string' ? fileName : ""}</span>
                    </p>
                </div>
    
                <Checkbox />
            </div>
        );
    }

}

export default SourceTableEntry;