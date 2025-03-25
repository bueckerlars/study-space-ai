import React, { useState } from 'react';
import useSourcesData from "@/hooks/useSourcesData";
import SourceTableEntry from "./source-table-entry";
import { Checkbox } from "../ui/checkbox";

interface SourceTableProps {
    projectId: string;
    isCollapsed?: boolean;
    handleOnEntryClicked: (source_id: string) => void;
}

const SourceTable: React.FC<SourceTableProps> = ({ projectId, isCollapsed, handleOnEntryClicked }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    // Prevent refetching when a dropdown is open.
    const { files, sources } = useSourcesData(projectId, { enabled: !dropdownOpen });

    const checkIsLoading = (sourceId: string) => {
        const source = sources.find((source) => source.source_id === sourceId);
        if (source?.summary_file_id) {
            return false;
        }
        return true;
    };

    return (
        <div className="flex flex-col mt-6">
            {!isCollapsed && (<div className="flex flex-row justify-between items-center px-4">
                <div>Select sources:</div>
                <Checkbox />
            </div>)}
            {files.map((file) => (
                <SourceTableEntry 
                    key={file.file_id} 
                    sourceId={file.sourceId}
                    fileName={file.name} 
                    fileType={file.type} 
                    onDropdownOpenChange={setDropdownOpen} 
                    isCollapsed={isCollapsed!}
                    handleOnClick={handleOnEntryClicked}
                    isLoading={checkIsLoading(file.sourceId)}
                />
            ))}
        </div>
    );
}

export default SourceTable;