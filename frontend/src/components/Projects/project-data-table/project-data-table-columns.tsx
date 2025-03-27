import { ColumnDef } from "@tanstack/react-table";
import { Project } from "@/types/Project";
import { Source } from "@/types";

interface ProjectWithSources extends Project {
  sources?: any[];
}

export const projectColumns: ColumnDef<ProjectWithSources>[] = [
    {
        header: "Name",
        accessorKey: "name"
    },
    {
        header: "Created At",
        accessorKey: "created_at",
        cell: ({ cell }) => {
            const date = cell.getValue<Date>();
            return date ? new Date(date).toLocaleDateString() : "";
        }
    },
    {
        header: "Source Count",
        accessorKey: "sources",
        id: "sourceCount",
        cell: ({ row }) => {
            const sources = row.original.sources as Source[] | undefined;
            return (
                <div style={{ textAlign: "center" }}>
                    {sources ? sources.length : 0}
                </div>
            );
        }
    }
];
