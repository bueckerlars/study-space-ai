import * as React from "react";
import { PanelLeftIcon, PanelRightIcon, Minimize2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardAction, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

// Constants
const COLLAPSED_WIDTH = "60px"; // Width when collapsed
const MIN_COLLAPSED_HEIGHT = "50px"; // Minimum height when collapsed to fit trigger
const MIN_WIDTH = "40px"; // Minimum width even when collapsed
const CARD_STATE_COOKIE = "card_collapsed_state";
const CARD_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Types
type CollapseDirection = "left" | "right";
type CardState = "collapsed" | "default" | "extended";

type CollapsableCardContextProps = {
  cardState: CardState;
  toggleCollapsed: () => void;
  setCardState: (state: CardState) => void;
  collapseDirection: CollapseDirection;
};

// Context
const CollapsableCardContext = React.createContext<CollapsableCardContextProps | null>(null);

// Hook for using the context
export function useCollapsableCard() {
  const context = React.useContext(CollapsableCardContext);
  if (!context) {
    throw new Error("useCollapsableCard must be used within a CollapsableCardProvider");
  }
  return context;
}

// Provider component
interface CollapsableCardProviderProps extends React.ComponentProps<"div"> {
  defaultCollapsed?: boolean;
  defaultState?: CardState;
  id?: string;
  fullHeight?: boolean;
  collapseDirection?: CollapseDirection;
  defaultWidth?: string;
  extendedWidth?: string;
}

export function CollapsableCardProvider({
  defaultCollapsed,
  defaultState,
  id,
  fullHeight = false,
  collapseDirection = "left",
  defaultWidth,
  extendedWidth,
  children,
  ...props
}: CollapsableCardProviderProps) {
  // Initial state: use defaultState if provided, otherwise legacy defaultCollapsed check.
  const initialState: CardState = defaultState ?? (defaultCollapsed ? "collapsed" : "default");
  const [cardState, setCardState] = React.useState<CardState>(initialState);
  
  const toggleCollapsed = React.useCallback(() => {
    if (cardState === "extended" || cardState === "collapsed") {
      setCardState("default");
    } else if (cardState === "default") {
      setCardState("collapsed");
    }
  }, [cardState]);
  
  // Load from cookie on mount if id is provided
  React.useEffect(() => {
    if (id) {
      const cookies = document.cookie.split(';');
      const cardCookie = cookies.find(cookie => 
        cookie.trim().startsWith(`${CARD_STATE_COOKIE}_${id}=`)
      );
      if (cardCookie) {
        const value = cardCookie.split('=')[1] as CardState;
        setCardState(value);
      }
    }
  }, [id]);

  // Store state in cookie if id is provided
  React.useEffect(() => {
    if (id) {
      document.cookie = `${CARD_STATE_COOKIE}_${id}=${cardState}; path=/; max-age=${CARD_COOKIE_MAX_AGE}`;
    }
  }, [cardState, id]);

  const contextValue = React.useMemo(() => ({
    cardState,
    toggleCollapsed,
    setCardState,
    collapseDirection
  }), [cardState, toggleCollapsed, collapseDirection]);
  
  // Compute width based on cardState:
  // collapsed: fixed COLLAPSED_WIDTH
  // extended: extendedWidth (fallback to defaultWidth)
  // default: defaultWidth or "100%"
  const computedWidth = cardState === "collapsed"
    ? COLLAPSED_WIDTH
    : cardState === "extended"
      ? (extendedWidth || defaultWidth || "100%")
      : (defaultWidth || "100%");
  
  return (
    <CollapsableCardContext.Provider value={contextValue}>
      <div
        data-state={cardState}
        data-direction={collapseDirection}
        style={{
          transition: "width 250ms ease, max-width 250ms ease",
          width: computedWidth,
          maxWidth: computedWidth,
          minWidth: MIN_WIDTH,
          height: fullHeight ? "100%" : "auto",
          minHeight: cardState === "collapsed" ? MIN_COLLAPSED_HEIGHT : "auto",
          display: fullHeight ? "flex" : "block",
          flexDirection: "column",
        }}
        {...props}
      >
        {children}
      </div>
    </CollapsableCardContext.Provider>
  );
}

// Main CollapsableCard component
export function CollapsableCard({
  className,
  children,
  defaultCollapsed,
  defaultState,
  id,
  fullHeight,
  collapseDirection,
  defaultWidth,
  extendedWidth,
  ...props
}: React.ComponentProps<typeof Card> & {
  defaultCollapsed?: boolean;
  defaultState?: CardState;
  id?: string;
  fullHeight?: boolean;
  collapseDirection?: CollapseDirection;
  defaultWidth?: string;
  extendedWidth?: string;
}) {
  return (
    <CollapsableCardProvider
      defaultCollapsed={defaultCollapsed}
      defaultState={defaultState}
      id={id}
      fullHeight={fullHeight}
      collapseDirection={collapseDirection}
      defaultWidth={defaultWidth}
      extendedWidth={extendedWidth}
    >
      <Card 
        className={cn(
          "relative overflow-hidden", 
          fullHeight && "flex flex-col h-full",
          className
        )} 
        {...props}
      >
        {children}
      </Card>
    </CollapsableCardProvider>
  );
}

// Trigger component to toggle collapse state
export function CollapsableCardTrigger({
  className,
  tooltip,
  ...props
}: React.ComponentProps<typeof Button> & {
  tooltip?: string;
}) {
  const { cardState, toggleCollapsed, collapseDirection } = useCollapsableCard();
  
  const button = (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "absolute z-10 transition-all duration-200",
        cardState !== "collapsed" && collapseDirection === "left" && "right-2 pl-2 top-4",
        cardState !== "collapsed" && collapseDirection === "right" && "left-2 pr-2 top-4",
        cardState === "collapsed" && "top-[14px] left-1/2 transform -translate-x-1/2",
        className
      )}
      onClick={toggleCollapsed}
      {...props}
    >
      {cardState === "extended" 
        ? <Minimize2Icon size={16} />
        : cardState === "collapsed" 
          ? (collapseDirection === "left" ? <PanelRightIcon size={16} /> : <PanelLeftIcon size={16} />)
          : (collapseDirection === "left" ? <PanelLeftIcon size={16} /> : <PanelRightIcon size={16} />)
      }
      <span className="sr-only">
        {cardState === "collapsed" || cardState === "extended" ? "Expand card" : "Collapse card"}
      </span>
    </Button>
  );
  
  if (!tooltip) {
    return button;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right">{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Separator component for use between header and content
export function CollapsableCardSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  const { cardState } = useCollapsableCard();
  
  return (
    <Separator
      className={cn(
        "my-1",
        // Add top margin when collapsed to prevent overlap with the trigger button
        cardState === "collapsed" && "mt-12", // Add sufficient margin to clear the trigger button
        className
      )}
      {...props}
    />
  );
}

// Modified Card components for use with CollapsableCard
export function CollapsableCardHeader({
  className,
  ...props
}: React.ComponentProps<typeof CardHeader>) {
  const { cardState } = useCollapsableCard();
  
  return (
    <CardHeader
      className={cn(
        className,
        cardState === "collapsed" && "mt-4 px-2 py-2"
      )}
      {...props}
    />
  );
}

export function CollapsableCardContent({
  className,
  ...props
}: React.ComponentProps<typeof CardContent>) {
  const { cardState } = useCollapsableCard();
  
  return (
    <CardContent
      className={cn(
        className,
        cardState === "collapsed" && "px-2",
        "flex-grow" // This helps the content area expand to fill available space
      )}
      {...props}
    />
  );
}

export function CollapsableCardFooter({
  className,
  ...props
}: React.ComponentProps<typeof CardFooter>) {
  const { cardState } = useCollapsableCard();
  
  return (
    <CardFooter
      className={cn(
        className,
        cardState === "collapsed" && "px-2"
      )}
      {...props}
    />
  );
}

// Re-export other card components with context-aware versions
export {
  CardTitle as CollapsableCardTitle,
  CardDescription as CollapsableCardDescription,
  CardAction as CollapsableCardAction
};
