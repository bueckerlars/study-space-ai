import { useEffect, useState } from "react";
import { Card, CardDescription, CardFooter, CardTitle } from "./ui/card";
import { getProjectByIdRequest } from "@/services/ApiService";
import { useAuth } from "@/provider/AuthProvider";
import { Project } from "@/types";

interface ProjectGaleryCardProps {
    projectId: number;
}

const ProjectGaleryCard = ({ projectId }: ProjectGaleryCardProps) => {
    const { authToken } = useAuth();
    const [project, setProject] = useState<Project | null>(null);

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString();
    }

    useEffect(() => {

        getProjectByIdRequest(authToken!, projectId)
            .then((response) => {
                const project: Project = response.data;
                console.log(project);
                setProject(project);
            })
            .catch((error) => {
                console.error(error);
            }
        );

    }, []);

    return (
        <Card className="px-4 flex flex-col" >    
            <CardTitle>{project?.name}</CardTitle>
            <CardDescription className="h-full">{project?.description}</CardDescription>
            <CardFooter className="">Created at: {formatDate(project?.created_at!)}</CardFooter>
        </Card> 
    );
}

export default ProjectGaleryCard;