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

const handleSummerizeClicked = (file: FileType) => {
    console.log("Summerize clicked: " + file.name)
}   

const handleRemoveClicked = (file: FileType) => {
    console.log("Remove clicked: " + file.name)
}

export const SourceDataTableColumns: ColumnDef<FileType>[] = [
    {
        accessorKey: "type",
        header: "Type",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const file = row.original
    
            return (
                <DropdownMenu>
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
]
