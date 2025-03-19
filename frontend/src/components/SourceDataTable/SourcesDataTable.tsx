import { DataTable } from "../ui/data-table";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useSourceDataTableColumns } from "./SourceDataTableColumns";
import { File as FileType } from "@/types";
import { getFilesByProjectRequest } from "@/services/ApiService";
import { useAuth } from "@/provider/AuthProvider";
import { FileIcon } from "lucide-react";
import { Label } from "../ui/label";

interface SourcesDataTableProps {
    projectId: string;
    refreshInterval?: number; // Optional prop for refresh interval in milliseconds
}

export interface SourcesDataTableRef {
    refreshFiles: () => void;
}

const SourcesDataTable = forwardRef<SourcesDataTableRef, SourcesDataTableProps>(({ projectId, refreshInterval = 30000 }, ref) => {   
    const { authToken } = useAuth();
    const [data, setData] = useState<FileType[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Pass menu state handlers to columns
    const columns = useSourceDataTableColumns({ 
        onMenuOpen: () => setIsMenuOpen(true),
        onMenuClose: () => setIsMenuOpen(false),
        onFileRemoved: () => fetchFiles() // Add refresh callback
    });

    const fetchFiles = () => {
        getFilesByProjectRequest(authToken!, parseInt(projectId)).then((response) => {
            const data: FileType[] = response.data;
            setData(data);
        }).catch((error) => {
            console.error(error);
        });
    };

    useImperativeHandle(ref, () => ({
        refreshFiles: fetchFiles
    }));

    useEffect(() => {
        fetchFiles();
    }, [authToken, projectId]);

    // Modified auto-refresh functionality to skip when menu is open
    useEffect(() => {
        const intervalId = setInterval(() => {
            // Only refresh if no menu is currently open
            if (!isMenuOpen) {
                fetchFiles();
            }
        }, refreshInterval);
        
        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, [authToken, projectId, refreshInterval, isMenuOpen]);

    return(
        <>
            {data.length > 0 && (
                <div className="flex flex-col gap-4 mt-4">
                    <Label>Sources</Label>
                    <DataTable columns={columns} data={data} showHeader={true} showBorders={false}/>
                </div>
            ) || (
                <div className="flex justify-center items-center h-40 flex-col gap-2 text-gray-400 h-full">
                    <FileIcon size={40}/>
                    <p className="text-center">
                        Saved sources are displayed here
                        Click on 'Add Sources' at the top to add PDFs or texts. 
                    </p>
                </div>
            )
            
            }
        </>
    );
});

export default SourcesDataTable;