import React, { useEffect, useState } from 'react';
import SourceTableEntry from "./source-table-entry";
import { Checkbox } from "../ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { useSource } from '@/provider/SourceProvider';

interface SourceTableProps {
    isCollapsed?: boolean;
    handleOnEntryClicked: (source_id: string) => void;
}

const SourceTable: React.FC<SourceTableProps> = ({ isCollapsed, handleOnEntryClicked }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { sourceFiles: files, sources, setEnabled } = useSource();

    useEffect(() => {
        setEnabled(!dropdownOpen);
    }, [dropdownOpen]);

    const checkIsLoading = (sourceId: string) => {
        const source = sources.find((source) => source.source_id === sourceId);
        if (source?.summary_file_id) {
            return false;
        }
        return true;
    };

    return (
        <div className="flex flex-col mt-6">
            {!isCollapsed && (<div className="flex flex-row justify-between items-center px-4 mb-2">
                <div>Select sources:</div>
                <Checkbox />
            </div>)}
            {files.map((file) => (
                <Tooltip delayDuration={1000}>
                    <TooltipTrigger asChild>
                        <div>
                            <SourceTableEntry 
                                key={file.file.file_id} 
                                sourceId={file.source_id}
                                fileName={file.file.name} 
                                fileType={file.file.type} 
                                onDropdownOpenChange={setDropdownOpen} 
                                isCollapsed={isCollapsed!}
                                handleOnClick={handleOnEntryClicked}
                                isLoading={checkIsLoading(file.source_id)}
                            />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        {file.file.name}
                    </TooltipContent>
                </Tooltip>
            ))}
        </div>
    );
}

export default SourceTable;