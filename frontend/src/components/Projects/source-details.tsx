import { BrainCog } from "lucide-react";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import { getFileContentRequest, getSourceByIdRequest } from "@/services/ApiService";
import { useAuth } from "@/provider/AuthProvider";
import { Source } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import ThemeList from "./theme-list";

interface SourceDetailsProps {
    sourceId: string;
}

const SourceDetails: React.FC<SourceDetailsProps> = ({ sourceId }) => {
    const { authToken } = useAuth();
    const [themes, setThemes] = useState<string[]>();
    const [sourceSummary, setSourceSummary] = useState<string>();
    const [sourceText, setSourceText] = useState<string>();

    useEffect(() => {
        console.log("Source ID", sourceId); 
        getSourceByIdRequest(authToken!, sourceId)
            .then((response) => {
                console.log("Source Response", response);
                const source: Source = response.data.data;
                console.log("Source", source);
                const jsonArray = source.themes;
                const stringArray: string[] = Array.isArray(jsonArray) 
                    ? jsonArray.filter((item): item is string => typeof item === "string") 
                    : [];
                console.log("Themes", stringArray);
                setThemes(stringArray);

                getFileContentRequest(authToken!, source.text_file_id!)
                .then((response) => {
                    console.log("Source Text", response);
                    setSourceText(response.data.content);
                })
                .catch((error) => {
                    console.error(error);
                });

                getFileContentRequest(authToken!, source.summary_file_id!)
                .then((response) => {
                    console.log("Source Summary", response);
                    setSourceSummary(response.data.content);
                })
                .catch((error) => {
                    console.error(error);
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }, [sourceId]);

    return (
        <div className="flex flex-col gap-2">
            <div className="rounded-lg p-4 bg-accent flex flex-col gap-2">
                <div className="flex flex-row items-center gap-2">
                    <BrainCog />
                    <span className="text-lg">Source summary</span>
                </div>
                <Separator />
                <ScrollArea className="h-80 pr-4">
                    <div className="flex flex-row gap-4 justfiy-between">
                        <span className="flex-3">{sourceSummary}</span>
                        <span className="flex-1">
                            <ThemeList themes={themes ? themes : []} />
                        </span>
                    </div>
                </ScrollArea>
            </div>
            <div className="p-4">
                <ScrollArea className="h-100">
                    <span>{sourceText}</span>
                </ScrollArea>
            </div>
        </div>
    );
};

export default SourceDetails;