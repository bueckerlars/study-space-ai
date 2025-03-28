import { Project, Source } from "@/types";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { SendHorizonal } from "lucide-react";
import ModelSelect from "../model-select";
import { useEffect, useState } from "react";
import { getSourcesByProjectRequest } from "@/services/ApiService";
import { useAuth } from "@/provider/AuthProvider";
import ProjectSummary from "./ProjectSummery";
import ChatScrollBox from "./chat/chat-scroll-area";

//@ts-ignore
const ChatCard: React.FC<{project: Project}> = ({ project }) => {
    const { authToken } = useAuth();
    const [sources, setSources] = useState<Source[]>([]);

    useEffect(() => {
        getSourcesByProjectRequest(authToken!, project.project_id!)
            .then((response) => {
                setSources(response.data.data);
            });
    }, [project]);

    return (
        <Card className='flex-col w-full h-full min-h-0 flex-2'>
            <div className="justify-between flex flex-row items-center px-6">
                <CardTitle>Chat</CardTitle>
                <ModelSelect/>
            </div>
            <Separator />
            <CardContent className="flex-1">
            {sources.length === 0 && (
                <div className="flex flex-col gap-2 h-full justify-center items-center text-gray-400">
                    <p className="text-gray-400 text-xl">Add Sources to begin a Chat</p>
                </div>
            // ) || <ProjectSummary projectId={project.project_id!} />}
            ) || <ChatScrollBox projectId={project.project_id!}/>}
            </CardContent>
            <CardFooter>
                <div className="flex flex-row gap-2 w-full border border-gray-800 rounded-lg p-2">
                    <Input placeholder='Add Source to begin a chat'/>
                    <Button><SendHorizonal/></Button>
                </div>
            </CardFooter>
        </Card>
    );
}

export default ChatCard;