import { Project } from "@/types";
import AddSourcesDialog from "../AddSourcesDialog";
import SourcesDataTable, { SourcesDataTableRef } from "../SourceDataTable/SourcesDataTable";
import { CollapsableCard, CollapsableCardTrigger, CollapsableCardSeparator, CollapsableCardContent } from "../ui/collapsable-card";
import ConditionalHeader from "../ConditionalHeader";
import { useState, useRef } from "react";

const SourcesCollapsableCard: React.FC<{ project: Project }> = ({ project }) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const sourcesDataTableRef = useRef<SourcesDataTableRef>(null);

    const handleCollapsedChanged = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleDialogClosed = () => {
        // Refresh sources data when dialog is closed
        sourcesDataTableRef.current?.refreshFiles();
    }

    return (
        <CollapsableCard id="sources" defaultCollapsed={false} collapsed={isCollapsed} onCollapsedChange={handleCollapsedChanged} fullHeight maxWidth={400} className='flex-1'>
            <CollapsableCardTrigger />
                <ConditionalHeader title="Sources" />
                <CollapsableCardSeparator />
                <CollapsableCardContent>
                <div className="w-full flex justify-center ">
                    <AddSourcesDialog projectName={project.name}  projectId={project.project_id} onClose={handleDialogClosed}/>
                </div>
                {!isCollapsed && (
                    <SourcesDataTable ref={sourcesDataTableRef} projectId={project.project_id!.toString()} refreshInterval={1000}/>
                )}
            </CollapsableCardContent>
        </CollapsableCard>
    );
}

export default SourcesCollapsableCard;