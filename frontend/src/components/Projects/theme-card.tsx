import { Button } from "../ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

type ThemeCardProps = {
	theme: string;
};

const ThemeCard = ({ theme }: ThemeCardProps) => {
    return (
        <Tooltip delayDuration={1000}>
            <TooltipTrigger asChild>
                <Button variant="outline" className="max-w-[120px] block truncate">
                    {theme}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                {theme}
            </TooltipContent>
        </Tooltip>
    );
}

export default ThemeCard;