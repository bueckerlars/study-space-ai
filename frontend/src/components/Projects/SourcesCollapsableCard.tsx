import { Project } from "@/types";
import AddSourcesDialog from "../AddSourcesDialog";
import { CollapsableCard, CollapsableCardTrigger, CollapsableCardSeparator, CollapsableCardContent, useCollapsableCard } from "../ui/collapsable-card";
import ConditionalHeader from "../ConditionalHeader";
import SourceTable from "../sources-table/source-table";
import SourceDetails from "./source-details";
import { useState } from "react";

// Updated SourcesContent now uses the hook internally
const SourcesContent: React.FC<{ projectId: string, projectTitle: string}> = ({ projectId }) => {
  const { cardState, setCardState } = useCollapsableCard();
  const [source_id, setSourceId] = useState<string | null>(null);

  const handleSourceTableEntryClicked = (source_id: string) => {
    setCardState("extended");
    setSourceId(source_id);
    console.log(`Source with ID ${source_id} clicked`);
  };

  if (cardState === "extended") {
    return <SourceDetails sourceId={source_id!} />;
  }

  return (
    <>
      <div className="w-full flex justify-center ">
          <AddSourcesDialog projectId={projectId}/>
      </div>
      <SourceTable 
         isCollapsed={cardState === "collapsed"} 
         handleOnEntryClicked={handleSourceTableEntryClicked}
      />
    </>
  );
};

// Removed the extra inner component and provider.
// Directly use CollapsableCard which creates its own provider.
const SourcesCollapsableCard: React.FC<{ project: Project }> = ({ project }) => {
    return (
        <CollapsableCard id="sources" defaultCollapsed={false} defaultWidth="400px" extendedWidth="600px" fullHeight className='flex-1'>
            <CollapsableCardTrigger />
            <ConditionalHeader title="Sources" />
            <CollapsableCardSeparator />
            <CollapsableCardContent>
                <SourcesContent projectId={project.project_id!} projectTitle={project.name}/>
            </CollapsableCardContent>
        </CollapsableCard>
    );
};

export default SourcesCollapsableCard;