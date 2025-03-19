import { Project } from "@/types";
import { PlusIcon, NotebookIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ConditionalHeader from "../ConditionalHeader";
import { Button } from "../ui/button";
import { CollapsableCard, CollapsableCardTrigger, CollapsableCardSeparator, CollapsableCardContent } from "../ui/collapsable-card";

//@ts-ignore
const StudioCollapsableCard: React.FC<{ project: Project }> = ({ project }) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const [showButtonText, setShowButtonText] = useState(true);
    const buttonRef = useRef<HTMLButtonElement>(null);
    
    // Check button width on mount and resize
        useEffect(() => {
            const checkButtonWidth = () => {
                if (buttonRef.current) {
                    setShowButtonText(buttonRef.current.offsetWidth >= 200);
                }
            };
    
            // Initial check
            checkButtonWidth();
    
            // Set up resize observer
            const resizeObserver = new ResizeObserver(checkButtonWidth);
            if (buttonRef.current) {
                resizeObserver.observe(buttonRef.current);
            }
    
            return () => resizeObserver.disconnect();
        }, []);

    const handleCollapsedChanged = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <CollapsableCard id="studio"  defaultCollapsed={false} collapsed={isCollapsed} onCollapsedChange={handleCollapsedChanged} fullHeight maxWidth={400} className="flex-1">
            <CollapsableCardTrigger />
            <ConditionalHeader title="Studio" />
            <CollapsableCardSeparator />
            <CollapsableCardContent>
            <Button ref={buttonRef} variant="outline" className="w-full">
                    <PlusIcon className="h-4 w-4" /> 
                    {showButtonText && <span className="ml-2">Add Note</span>}
                </Button>
                {!isCollapsed && (
                    <div className="flex justify-center items-center h-40 flex-col gap-2 text-gray-400 h-full">
                        <NotebookIcon size={40}/>
                        <p className='text-center'>Saved notes are displayed hereTo create a new note, you must save a chat message or click on ‘Add note’ at the top.</p>
                    </div>
                )}
            </CollapsableCardContent>
        </CollapsableCard>
    );
}

export default StudioCollapsableCard;