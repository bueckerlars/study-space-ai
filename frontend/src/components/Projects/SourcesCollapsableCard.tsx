import { Project } from "@/types";
import AddSourcesDialog from "../AddSourcesDialog";
import { CollapsableCard, CollapsableCardTrigger, CollapsableCardSeparator, CollapsableCardContent } from "../ui/collapsable-card";
import ConditionalHeader from "../ConditionalHeader";
import { useState } from "react";
import SourceTable from "../sources-table/source-table";

const SourcesCollapsableCard: React.FC<{ project: Project }> = ({ project }) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    const handleCollapsedChanged = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <CollapsableCard id="sources" defaultCollapsed={false} collapsed={isCollapsed} onCollapsedChange={handleCollapsedChanged} fullHeight maxWidth={400} className='flex-1'>
            <CollapsableCardTrigger />
                <ConditionalHeader title="Sources" />
                <CollapsableCardSeparator />
                <CollapsableCardContent>
                <div className="w-full flex justify-center ">
                    <AddSourcesDialog projectId={project.project_id}/>
                </div>
                
                {
                    <SourceTable projectId={project.project_id!} isCollapsed={isCollapsed}/>
                }
            </CollapsableCardContent>
        </CollapsableCard>
    );
}

export default SourcesCollapsableCard;