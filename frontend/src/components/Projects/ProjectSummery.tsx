import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { Copy, Pin } from "lucide-react";
import { useProject } from "@/provider/ProjectProvider";

const ProjectSummary = () => {
    const { project } = useProject();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (project?.description && project?.name) {
            setLoading(false);
        }
    }, [project]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(project?.description!);
    };

    return (
        <div>
            {loading && (
                <div className="space-y-3">  
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-9/10" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-8/10" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-7/10" />
                </div>
            )}
            {!loading && (
                <div className="gap-3 flex flex-col">
                    <p className="text-lg font-bold text-gray-300">{project?.name}</p>
                    <div className="text-sm font-gray-400"><ReactMarkdown>{project?.description}</ReactMarkdown></div>
                    <div className="flex flex-row gap-2">
                        <Button variant={"outline"}>
                            <Pin />
                            Save to Note
                        </Button>
                        <Button 
                            onClick={copyToClipboard} 
                            variant={"ghost"}>
                            <Copy />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProjectSummary;