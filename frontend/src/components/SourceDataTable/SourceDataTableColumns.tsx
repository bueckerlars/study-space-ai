"use client"

import { ColumnDef } from "@tanstack/react-table"
import { File as FileType } from "@/types"
import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import { deleteFileRequest } from "@/services/ApiService"
import { useAuth } from "@/provider/AuthProvider"

// Interface for menu state handlers
interface SourceDataTableColumnsProps {
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  onFileRemoved?: () => void; // New callback for file removal
}

// Create a hook that returns the columns with access to auth context
export const useSourceDataTableColumns = (props?: SourceDataTableColumnsProps): ColumnDef<FileType>[] => {
    const { authToken } = useAuth(); // Access authToken from the AuthProvider
    
    const handleSummerizeClicked = (file: FileType) => {
        console.log("Summerize clicked: " + file.name)
        props?.onMenuClose?.(); // Close menu after action
    }   

    const handleRemoveClicked = (file: FileType) => {
        deleteFileRequest(authToken!, file.file_id)
            .then(() => {
                // Call refresh function after successful deletion
                props?.onFileRemoved?.();
            })
            .catch(error => {
                console.error("Error deleting file:", error);
            })
            .finally(() => {
                props?.onMenuClose?.(); // Close menu after action
            });
    }

    return [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
                const name = row.getValue("name") as string
                return (
                    <div className="max-w-[250px] truncate" title={name}>
                        {name}
                    </div>
                )
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const file = row.original
        
                return (
                    <DropdownMenu onOpenChange={(open) => {
                        if (open) {
                            props?.onMenuOpen?.();
                        } else {
                            props?.onMenuClose?.();
                        }
                    }}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleSummerizeClicked(file)}>Summerize</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRemoveClicked(file)}>Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ];
}
