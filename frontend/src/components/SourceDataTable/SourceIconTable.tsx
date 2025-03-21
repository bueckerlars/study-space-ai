import { useEffect } from "react";
import { Button } from "../ui/button";
import useSourcesData from "@/hooks/useSourcesData";
import FileTypeIcon from "../FileTypeIcon";

interface SourceIconTableProps {
    projectId: string;
    refreshInterval?: number; // Optional prop for refresh interval in milliseconds
}

const SourceIconTable: React.FC<SourceIconTableProps> = ({ projectId, refreshInterval = 30000 }) => {
    const { files, fetchSources } = useSourcesData(projectId);

    // Auto-refresh using hook’s fetchSources
    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchSources();
        }, refreshInterval);
        
        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, [fetchSources, refreshInterval]);

    return (
        <div className="flex flex-col w-full item-center mt-2">
            {files.map((file) => (
                <div key={file.file_id} className="flex items-center justify-center w-full p-2">
                    <div className="flex items-center">
                        <Button variant={"ghost"}>
                            <FileTypeIcon type={file.type}  />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SourceIconTable;