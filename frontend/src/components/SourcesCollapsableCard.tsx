import { Project } from "@/types";
import AddSourcesDialog from "./AddSourcesDialog";
import SourcesDataTable from "./SourceDataTable/SourcesDataTable";
import { CollapsableCard, CollapsableCardTrigger, CollapsableCardSeparator, CollapsableCardContent } from "./ui/collapsable-card";
import ConditionalHeader from "./ConditionalHeader";
import { useState } from "react";

const SourcesCollapsableCard: React.FC<{ project: Project }> = ({ project }) => {
    const  [isCollapsed, setIsCollapsed] = useState<boolean>(false);

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
                    <AddSourcesDialog projectName={project.name} />
                </div>
                {!isCollapsed && (
                    <SourcesDataTable projectId={project.project_id!.toString()} />
                )}
            </CollapsableCardContent>
        </CollapsableCard>
    );
}

export default SourcesCollapsableCard;