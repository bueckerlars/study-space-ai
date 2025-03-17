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
        <Card>    
            <CardTitle>{project?.name}</CardTitle>
            <CardDescription>{project?.description}</CardDescription>
            <CardFooter>Created at: {project?.created_at?.toLocaleDateString()}</ CardFooter>
        </Card> 
    );
}

export default ProjectGaleryCard;