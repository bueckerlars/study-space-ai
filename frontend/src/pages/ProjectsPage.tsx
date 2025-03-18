import AddProjectButton from "@/components/Projects/AddProjectButton";
import ProjectGalery from "@/components/Projects/ProjectGalery";

export const ProjectsPage = () => {
    return (
        <div className="px-12">
            <AddProjectButton/>
            <ProjectGalery/>
        </div>
    );
};