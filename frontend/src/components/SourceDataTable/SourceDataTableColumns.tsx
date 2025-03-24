"use client"

import { ColumnDef } from "@tanstack/react-table"
import { File as FileType } from "@/types"
import { MoreHorizontal, FileDigit, Trash2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import { deleteSourceRequest, summarizeRequest } from "@/services/ApiService"
import { useAuth } from "@/provider/AuthProvider"
import FileTypeIcon from "../FileTypeIcon"

// Interface for menu state handlers
interface SourceDataTableColumnsProps {
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  onFileRemoved?: () => void; 
}

export const useSourceDataTableColumns = (props?: SourceDataTableColumnsProps): ColumnDef<FileType>[] => {
    const { authToken } = useAuth(); 
    
    const handleSummerizeClicked = (file: FileType & { sourceId?: string }) => {
        console.log("Summerize clicked: " + file.name);

        summarizeRequest(authToken!, file.sourceId!);

        props?.onMenuClose?.(); // Close menu after action
    }   

    const handleRemoveClicked = (file: FileType & { sourceId?: string }) => {
        deleteSourceRequest(authToken!, file.sourceId!)
            .then(() => {
                props?.onFileRemoved?.();
            })
            .catch(error => {
                console.error("Error deleting source:", error);
            })
            .finally(() => {
                props?.onMenuClose?.(); // Close menu after action
            });
    }

    return [
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => {
                const type = row.getValue("type") as string
                return <FileTypeIcon type={type} />
            },
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
                const name = row.getValue("name") as string
                return (
                    <div className="max-w-[220px] truncate" title={name}>
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
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => handleSummerizeClicked(file)}>
                                <FileDigit className="mr-2 h-4 w-4" />
                                Summerize
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive" onClick={() => handleRemoveClicked(file)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
        // {
        //     id: "select",
        //     header: ({ table }) => (
        //       <Checkbox
        //         checked={
        //           table.getIsAllPageRowsSelected() ||
        //           (table.getIsSomePageRowsSelected() && "indeterminate")
        //         }
        //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        //         aria-label="Select all"
        //       />
        //     ),
        //     cell: ({ row }) => (
        //       <Checkbox
        //         checked={row.getIsSelected()}
        //         onCheckedChange={(value) => row.toggleSelected(!!value)}
        //         aria-label="Select row"
        //       />
        //     ),
        //   },
    ];
}
