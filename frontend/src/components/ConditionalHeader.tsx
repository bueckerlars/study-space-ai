import { CollapsableCardHeader, CollapsableCardTitle, useCollapsableCard } from "./ui/collapsable-card";

// Header component that only renders when card is expanded
const ConditionalHeader: React.FC<{title: string}> = ({ title }) => {
    const { cardState } = useCollapsableCard();
    
    if (cardState === "collapsed") {
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
