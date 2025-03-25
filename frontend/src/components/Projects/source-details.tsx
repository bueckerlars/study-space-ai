import { BrainCog } from "lucide-react";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import { getFileContentRequest, getSourceByIdRequest } from "@/services/ApiService";
import { useAuth } from "@/provider/AuthProvider";
import { Source } from "@/types";
import { ScrollArea } from "../ui/scroll-area";

interface SourceDetailsProps {
    sourceId: string;
}

const SourceDetails: React.FC<SourceDetailsProps> = ({ sourceId }) => {
    const { authToken } = useAuth();
    const [sourceSummary, setSourceSummary] = useState<string>();
    const [sourceText, setSourceText] = useState<string>();

    useEffect(() => {
        console.log("Source ID", sourceId); 
        getSourceByIdRequest(authToken!, sourceId)
            .then((response) => {
                console.log("Source Response", response);
                const source: Source = response.data.data;

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
                    <span>{sourceSummary}</span>
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