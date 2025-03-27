import { DataTable } from "@/components/ui/data-table";
import { projectColumns } from "./project-data-table-columns";
import { Project } from "@/types/Project";
import { useEffect, useState } from "react";
import { getSourcesByProjectRequest, getUserProjectsRequest } from "@/services/ApiService";
import { useAuth } from "@/provider/AuthProvider";

export interface ProjectWithSources extends Project {
  sources?: any[];
}

export function ProjectDataTable() {
    const { authToken } = useAuth();
    const [projectsWithSources, setProjectsWithSources] = useState<ProjectWithSources[]>([]);

    useEffect(() => {
        const fetchProjectsWithSources = async () => {
            try {
                const response = await getUserProjectsRequest(authToken!);
                const projects = response.data;

                const projectsWithSources = await Promise.all(
                    projects.map(async (project: Project) => {
                        const sourcesResponse = await getSourcesByProjectRequest(authToken!, project.project_id!);
                        const sources = sourcesResponse.data.data;
                        return { ...project, sources };
                    })
                );

                setProjectsWithSources(projectsWithSources);
            } catch (error) {
                console.error("Error fetching projects or sources:", error);
            }
        };

        fetchProjectsWithSources();
    }, [authToken]);

    return (
        <div className="mt-4">
            <DataTable 
                columns={projectColumns} 
                data={projectsWithSources} 
            />
        </div>
    );
}
