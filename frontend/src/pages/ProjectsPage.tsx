import { useEffect, useState } from 'react';
import { useHeader } from '@/provider/HeaderProvider';
import AddProjectButton from "@/components/Projects/AddProjectButton";
import ProjectGalery from "@/components/Projects/ProjectGalery";
import { ProjectDataTable } from '@/components/Projects/project-data-table/project-data-table';
import ViewToggle from '@/components/ViewToggle';

export const ProjectsPage = () => {
    const { setTitle } = useHeader();
    const [showGallery, setShowGallery] = useState(true);
    
    useEffect(() => {
        setTitle('Projects');
    }, [setTitle]);
    
    return (
        <div className="px-12 flex flex-col w-full">
            <div className="flex flex-row justify-between items-center">
                <AddProjectButton/>
                <ViewToggle showGallery={showGallery} setShowGallery={setShowGallery} />
            </div>
            {showGallery ? <ProjectGalery/> : <ProjectDataTable/>}
        </div>
    );
};