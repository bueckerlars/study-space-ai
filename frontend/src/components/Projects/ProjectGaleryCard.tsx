import { useEffect, useState } from "react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { deleteProjectRequest, getProjectByIdRequest, getSourcesByProjectRequest } from "@/services/ApiService";
import { useAuth } from "@/provider/AuthProvider";
import { Project, Source } from "@/types";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { EditIcon, MoreVertical, TrashIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import EditProjectTitleDialog from "./EditProjectTitleDialog";

interface ProjectGaleryCardProps {
    projectId: string;
}

const ProjectGaleryCard = ({ projectId }: ProjectGaleryCardProps) => {
    const { authToken } = useAuth();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [sources, setSources] = useState<Source[]>([]);

    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString();
    }

    const fetchProject = () => {
        getProjectByIdRequest(authToken!, projectId)
            .then((response) => {
                const project: Project = response.data;
                console.log(project);
                setProject(project);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchProject();
    }, []);

    useEffect(() => {
        getSourcesByProjectRequest(authToken!, projectId)
            .then((response) => {
                const sources: Source[] = response.data.data;
                console.log("Sources", sources);
                setSources(sources);
            }
        )
        .catch((error) => {
            console.error(error);
        });    
    }, [project]);

    const handleClickOnCard = () => {
        navigate(`/projects/${projectId}`);
    }

    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // This prevents the click from bubbling up to the parent Card
        // Add any button click logic here
        console.log("Button clicked");
    }

    const handleDeleteProject = () => {
        // Add delete project logic here
        console.log("Delete project");
        deleteProjectRequest(authToken!, projectId)
            .then((response) => {
                console.log(response);
                navigate("/projects");
            }
        )
        .catch((error) => {
            console.error(error);
        });
    }

    const handleDialogOpenChanged = (open: boolean) => {
        setEditDialogOpen(open);
    }

    return (
        <>
            <Card className="flex flex-col hover:cursor-pointer min-h-60" onClick={handleClickOnCard}>    
                <CardHeader className="flex flex-row justify-between items-top">
                    <CardTitle className="pt-2">{project?.name}</CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button onClick={handleButtonClick} variant="ghost">
                                <MoreVertical size={24} />
                            </Button>
                        </DropdownMenuTrigger>
                        {/* Added onClick to prevent propagation */}
                        <DropdownMenuContent align="start" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                                <EditIcon/> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive" onClick={handleDeleteProject}>
                                <TrashIcon/> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                <CardDescription className="h-full"></CardDescription>
                <CardFooter className="flex flex-row justify-between">
                    <span>
                        Created at: {formatDate(project?.created_at!)}
                    </span>
                    <span>
                        {sources.length} Sources
                    </span>
                </CardFooter>
            </Card> 
            <EditProjectTitleDialog 
                project={project} 
                open={editDialogOpen} 
                onOpenChanged={handleDialogOpenChanged} 
                onProjectUpdated={fetchProject} // new prop for refetching
            />
        </>
    );
}

export default ProjectGaleryCard;