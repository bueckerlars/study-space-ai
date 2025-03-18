import { CollapsableCardHeader, CollapsableCardTitle, useCollapsableCard } from "./ui/collapsable-card";

// Header component that only renders when card is expanded
const ConditionalHeader: React.FC<{title: string}> = ({ title }) => {
    const { isCollapsed } = useCollapsableCard();
    
    if (isCollapsed) {
    return null;
    }
    
    return (
    <>
        <CollapsableCardHeader>
        <CollapsableCardTitle>{title}</CollapsableCardTitle>
        </CollapsableCardHeader>
    </>
    );
};

export default ConditionalHeader;
