import * as React from "react";
import { PanelLeftIcon, PanelRightIcon } from "lucide-react";
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

type CollapsableCardContextProps = {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
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
  id?: string;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  fullHeight?: boolean;
  collapseDirection?: CollapseDirection;
  maxWidth?: string | number;
}

export function CollapsableCardProvider({
  defaultCollapsed = false,
  id,
  collapsed: collapsedProp,
  onCollapsedChange,
  fullHeight = false,
  collapseDirection = "left",
  maxWidth,
  children,
  ...props
}: CollapsableCardProviderProps) {
  // State for collapsed status
  const [_isCollapsed, _setCollapsed] = React.useState(defaultCollapsed);
  
  // Use controlled or uncontrolled pattern
  const isCollapsed = collapsedProp !== undefined ? collapsedProp : _isCollapsed;
  
  const setCollapsed = React.useCallback(
    (value: boolean) => {
      if (onCollapsedChange) {
        onCollapsedChange(value);
      } else {
        _setCollapsed(value);
      }

      // Store state in cookie if id is provided
      if (id) {
        document.cookie = `${CARD_STATE_COOKIE}_${id}=${value}; path=/; max-age=${CARD_COOKIE_MAX_AGE}`;
      }
    },
    [onCollapsedChange, id]
  );

  // Load from cookie on mount if id is provided
  React.useEffect(() => {
    if (id && collapsedProp === undefined) {
      const cookies = document.cookie.split(';');
      const cardCookie = cookies.find(cookie => 
        cookie.trim().startsWith(`${CARD_STATE_COOKIE}_${id}=`)
      );
      
      if (cardCookie) {
        const value = cardCookie.split('=')[1];
        _setCollapsed(value === 'true');
      }
    }
  }, [id, collapsedProp]);

  // Toggle function
  const toggleCollapsed = React.useCallback(() => {
    setCollapsed(!isCollapsed);
  }, [isCollapsed, setCollapsed]);

  const contextValue = React.useMemo(() => ({
    isCollapsed,
    toggleCollapsed,
    setCollapsed,
    collapseDirection
  }), [isCollapsed, toggleCollapsed, setCollapsed, collapseDirection]);

  return (
    <CollapsableCardContext.Provider value={contextValue}>
      <div
        data-state={isCollapsed ? "collapsed" : "expanded"}
        data-direction={collapseDirection}
        style={{
          transition: "width 250ms ease, max-width 250ms ease",
          width: isCollapsed ? COLLAPSED_WIDTH : "100%",
          maxWidth: isCollapsed ? COLLAPSED_WIDTH : (maxWidth || "100%"),
          minWidth: MIN_WIDTH, // Ensure minimum width in all states
          height: fullHeight ? "100%" : "auto",
          minHeight: isCollapsed ? MIN_COLLAPSED_HEIGHT : "auto",
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
  id,
  collapsed,
  onCollapsedChange,
  fullHeight,
  collapseDirection,
  maxWidth,
  ...props
}: React.ComponentProps<typeof Card> & {
  defaultCollapsed?: boolean;
  id?: string;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  fullHeight?: boolean;
  collapseDirection?: CollapseDirection;
  maxWidth?: string | number;
}) {
  return (
    <CollapsableCardProvider
      defaultCollapsed={defaultCollapsed}
      id={id}
      collapsed={collapsed}
      onCollapsedChange={onCollapsedChange}
      fullHeight={fullHeight}
      collapseDirection={collapseDirection}
      maxWidth={maxWidth}
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
  const { isCollapsed, toggleCollapsed, collapseDirection } = useCollapsableCard();

  const button = (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "absolute z-10 transition-all duration-200",
        // Positioning based on collapse direction and state
        !isCollapsed && collapseDirection === "left" && "right-2 pl-2 top-4",
        !isCollapsed && collapseDirection === "right" && "left-2 pr-2 top-4",
        // Center horizontally when collapsed
        isCollapsed && "top-[14px] left-1/2 transform -translate-x-1/2",
        className
      )}
      onClick={toggleCollapsed}
      {...props}
    >
      {isCollapsed 
        ? (collapseDirection === "left" ? <PanelRightIcon size={16} /> : <PanelLeftIcon size={16} />)
        : (collapseDirection === "left" ? <PanelLeftIcon size={16} /> : <PanelRightIcon size={16} />)
      }
      <span className="sr-only">
        {isCollapsed ? "Expand card" : "Collapse card"}
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
  const { isCollapsed } = useCollapsableCard();
  
  return (
    <Separator
      className={cn(
        "my-1",
        // Add top margin when collapsed to prevent overlap with the trigger button
        isCollapsed && "mt-12", // Add sufficient margin to clear the trigger button
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
  const { isCollapsed } = useCollapsableCard();
  
  return (
    <CardHeader
      className={cn(
        className,
        isCollapsed && "mt-4 px-2 py-2"
      )}
      {...props}
    />
  );
}

export function CollapsableCardContent({
  className,
  ...props
}: React.ComponentProps<typeof CardContent>) {
  const { isCollapsed } = useCollapsableCard();
  
  return (
    <CardContent
      className={cn(
        className,
        isCollapsed && "px-2",
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
  const { isCollapsed } = useCollapsableCard();
  
  return (
    <CardFooter
      className={cn(
        className,
        isCollapsed && "px-2"
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
