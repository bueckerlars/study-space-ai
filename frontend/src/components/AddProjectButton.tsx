import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { createProjectRequest } from "@/services/ApiService";
import { useAuth } from "@/provider/AuthProvider";
import { Project } from "@/types";
import { useNavigate } from "react-router-dom";

const AddProjectButton = () => {
    const { authToken } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = () => {
        console.log("Add project");
        createProjectRequest(authToken!, "Untitled").then((response) => {
            const project: Project = response.data;
            console.log(project);
            navigate(`/projects/${project.project_id}`);
        }
        ).catch((error) => {
            console.error(error);
        });
    }

    return (
        <Button onClick={handleSubmit}>
            <PlusIcon size={24} />
            Add Project
        </Button>
    );
}

export default AddProjectButton;