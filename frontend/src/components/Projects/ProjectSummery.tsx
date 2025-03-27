import ReactMarkdown from "react-markdown";
import { useAuth } from "@/provider/AuthProvider";
import { generateProjectSummaryRequest, getProjectByIdRequest } from "@/services/ApiService";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

type ProjectSummaryProps = {
    projectId: string;
}

const ProjectSummary = ({ projectId } : ProjectSummaryProps) => {
    const { authToken } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [projectDescription, setProjectDescription] = useState<string>();
    const [projectTitle, setProjectTitle] = useState<string>();

    useEffect(() => {
        getProjectByIdRequest(authToken!, projectId)
        .then((response) => {
            setProjectTitle(response.data.name);
            console.log(response.data);
            
            if (!response.data.description) {
                generateProjectSummaryRequest(authToken!, projectId)
                    .then((response) => {
                        setProjectDescription(response.data.data.summary);
                    });        
            } else {
                setProjectDescription(response.data.description);
            }
        });
    }, [projectTitle]);

    useEffect(() => {
        if (projectDescription && projectTitle) {
            setLoading(false);
        }
    }, [projectDescription, projectTitle]);

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
                <div className="font-gray-400 gap-3 flex flex-col">
                    <p className="text-lg font-bold text-gray-300">{projectTitle}</p>
                    <div className="text-sm"><ReactMarkdown>{projectDescription}</ReactMarkdown></div>
                </div>
            )}
        </div>
    );
}

export default ProjectSummary;