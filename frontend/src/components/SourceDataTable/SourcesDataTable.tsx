import { DataTable } from "../ui/data-table";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useSourceDataTableColumns } from "./SourceDataTableColumns";
import { File as FileType, Source as SourceType } from "@/types";
import { getFileByIdRequest, getSourcesByProjectRequest } from "@/services/ApiService";
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
    const [sources, setSources] = useState<SourceType[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Pass menu state handlers to columns
    const columns = useSourceDataTableColumns({ 
        onMenuOpen: () => setIsMenuOpen(true),
        onMenuClose: () => setIsMenuOpen(false),
        onFileRemoved: () => fetchFiles(), // Add refresh callback
    });

    const fetchSources = () => {
        getSourcesByProjectRequest(authToken!, projectId).then((response) => {
            const data: SourceType[] = response.data.data;
            setSources(data);
        }
        ).catch((error) => {
            console.error(error);
        });
    };

    const fetchFiles = async () => {
        try {
            const filePromises = sources.map(source => 
                getFileByIdRequest(authToken!, source.source_file_id!)
                    .then(response => ({ ...response.data, sourceId: source.source_id }))
                    .catch(error => {
                        console.error(error);
                        return null;
                    })
            );
            
            const files = await Promise.all(filePromises);
            setData(files.filter(file => file !== null));
        } catch (error) {
            console.error("Error fetching files:", error);
            setData([]);
        }
    };

    useImperativeHandle(ref, () => ({
        refreshFiles: fetchFiles
    }));

    useEffect(() => {
        fetchSources();
    }, [authToken, projectId]);

    useEffect(() => {
        fetchFiles();
    }, [sources]);

    // Modified auto-refresh functionality to skip when menu is open
    useEffect(() => {
        const intervalId = setInterval(() => {
            // Only refresh if no menu is currently open
            if (!isMenuOpen) {
                fetchSources();
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
                    <DataTable columns={columns} data={data} showHeader={false} showBorders={false}/>
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