import { useEffect } from 'react';
import { useHeader } from '@/provider/HeaderProvider';
import AddProjectButton from "@/components/Projects/AddProjectButton";
import ProjectGalery from "@/components/Projects/ProjectGalery";

export const ProjectsPage = () => {
    const { setTitle } = useHeader();
    
    useEffect(() => {
        setTitle('Projects');
    }, [setTitle]);
    
    return (
        <div className="px-12">
            <AddProjectButton/>
            <ProjectGalery/>
        </div>
    );
};