import useSourceDetails from "@/hooks/useSourceDetails";
import { useEffect } from "react";
import { BrainCog, ChevronsUpDown } from "lucide-react";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import ThemeList from "./theme-list";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Button } from "../ui/button";
import ReactMarkdown from "react-markdown";

interface SourceDetailsProps {
    sourceId: string;
}

const SourceDetails: React.FC<SourceDetailsProps> = ({ sourceId }) => {
    const { summary, text, themes, loading, error, fetchSourceDetails } = useSourceDetails();

    useEffect(() => {
        fetchSourceDetails(sourceId);
    }, [sourceId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex flex-col gap-2">
            <Collapsible defaultOpen>
                <div className="rounded-lg p-4 bg-accent flex flex-col gap-2 flex-shrink-0">
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center gap-2">
                            <BrainCog />
                            <span className="text-lg">Source summary</span>
                        </div>
                        <CollapsibleTrigger>
                            <Button variant="ghost">
                                <ChevronsUpDown/>
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                        <Separator />   
                        <ScrollArea className="h-80 pr-4">
                            <div className="flex flex-row gap-4 justfiy-between mt-4">
                                <span className="flex-3"><ReactMarkdown>{summary}</ReactMarkdown></span>
                                <span className="flex-1">
                                    <ThemeList themes={themes} />
                                </span>
                            </div>
                        </ScrollArea>
                    </CollapsibleContent>
                </div>
            </Collapsible>
            <div className="flex p-4 h-110">
                <ScrollArea>
                    <span>{text}</span>
                </ScrollArea>
            </div>
        </div>
    );
};

export default SourceDetails;