import { useAuth } from "@/provider/AuthProvider";
import { getUserProjectsRequest } from "@/services/ApiService";
import { Project } from "@/types";
import { useEffect, useState } from "react";
import ProjectGaleryCard from "./ProjectGaleryCard";

const ProjectGalery = () => {
    const { authToken } = useAuth();    
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        // fetch all projects
        getUserProjectsRequest(authToken!)
            .then((response) => {
                const projects: Project[] = response.data;
                setProjects(projects);
            }
        )
        .catch((error) => {
            console.error(error);
        });
    }, []);

    return (
        <div className="grid grid-cols-3 gap-4 h-full flex-1 mt-6">
            {projects.map((project) => (<ProjectGaleryCard key={project.project_id} projectId={project.project_id!} />))}
        </div>
    );
}

export default ProjectGalery;