import { Project } from "@/types";
import { PlusIcon, NotebookIcon } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import ConditionalHeader from "../ConditionalHeader";
import { Button } from "../ui/button";
import { CollapsableCard, CollapsableCardTrigger, CollapsableCardSeparator, CollapsableCardContent, useCollapsableCard } from "../ui/collapsable-card";

// Neue Komponente zur Auswertung des CardState
const StudioContent: React.FC = () => {
  const { cardState } = useCollapsableCard();
  if (cardState === "collapsed") return null;
  return (
    <div className="flex justify-center items-center h-40 flex-col gap-2 text-gray-400 h-full">
      <NotebookIcon size={40} />
      <p className="text-center">
        Saved notes are displayed here. To create a new note, you must save a chat message or click on ‘Add note’ at the top.
      </p>
    </div>
  );
};

const StudioCollapsableCard: React.FC<{ project: Project }> = ({ project }) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [showButtonText, setShowButtonText] = useState(true);
    
    useEffect(() => {
      const checkButtonWidth = () => {
        if (buttonRef.current) {
          setShowButtonText(buttonRef.current.offsetWidth >= 200);
        }
      };
      checkButtonWidth();
      const resizeObserver = new ResizeObserver(checkButtonWidth);
      if (buttonRef.current) {
        resizeObserver.observe(buttonRef.current);
      }
      return () => resizeObserver.disconnect();
    }, []);

    return (
        <CollapsableCard id="studio" defaultCollapsed={false} defaultWidth="400px" extendedWidth="600px" fullHeight className="flex-1">
            <CollapsableCardTrigger />
            <ConditionalHeader title="Studio" />
            <CollapsableCardSeparator />
            <CollapsableCardContent>
                <Button ref={buttonRef} variant="outline" className="w-full">
                    <PlusIcon className="h-4 w-4" /> 
                    {showButtonText && <span className="ml-2">Add Note</span>}
                </Button>
                <StudioContent />
            </CollapsableCardContent>
        </CollapsableCard>
    );
};

export default StudioCollapsableCard;