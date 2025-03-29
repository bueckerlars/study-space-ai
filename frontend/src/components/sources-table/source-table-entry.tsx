import React, { useState } from "react";
import { MoreVertical, Trash2, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import FileTypeIcon from "../FileTypeIcon";
import { Checkbox } from "../ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { deleteSourceRequest } from "@/services/ApiService";
import { useAuth } from "@/provider/AuthProvider";
import { useSource } from "@/provider/SourceProvider";

interface SourceTableEntryProps {
    fileName: string;
    sourceId: string;
    fileType: string;
    isCollapsed: boolean;
    onDropdownOpenChange?: (open: boolean) => void;
    handleOnClick: (source_id: string) => void;
    isLoading: boolean;
}

const SourceTableEntry: React.FC<SourceTableEntryProps> = ({ fileName, sourceId, fileType, isCollapsed, onDropdownOpenChange, handleOnClick, isLoading }) => {
    const { authToken } = useAuth();
    const [isHovered, setIsHovered] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { refetchCallback } = useSource();

    const handleRemove = () => {
        deleteSourceRequest(authToken!, sourceId);
        refetchCallback();
    };

    if (isCollapsed) {
        return (
            <div className="items-center">
                <Button 
                    variant={"ghost"} 
                    className="h-10 w-10 px-2 rounded-full" 
                    onClick={() => { if(!isLoading) handleOnClick(sourceId); }}
                >
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
                onClick={() => { if(!isLoading) handleOnClick(sourceId); }}
            >
                <div className="flex flex-row justify-start items-center">
                    <div className="mr-2 min-w-10">
                        { (!isLoading && (isHovered || dropdownOpen)) ? (
                            <DropdownMenu onOpenChange={(open) => { 
                                if(!isLoading) {
                                    setDropdownOpen(open); 
                                    if(onDropdownOpenChange) onDropdownOpenChange(open);
                                }
                            }}>
                                <DropdownMenuTrigger asChild>
                                    <Button onClick={(e) => e.stopPropagation()} variant="ghost" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem variant="destructive" onClick={(e) => { e.stopPropagation(); handleRemove(); }}>
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
    
                { isLoading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                    <Checkbox />
                ) }
            </div>
        );
    }

}

export default SourceTableEntry;