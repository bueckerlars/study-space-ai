import ChatCard from '@/components/Projects/ChatCard';
import SourcesCollapsableCard from '@/components/Projects/SourcesCollapsableCard';
import StudioCollapsableCard from '@/components/Projects/StudioCollapsableCard';
import { useHeader } from '@/provider/HeaderProvider';
import { useProject } from '@/provider/ProjectProvider';
import { SourceProvider } from '@/provider/SourceProvider';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { project, loading } = useProject();
  const { setTitle } = useHeader();

  useEffect(()=> {
    setTitle(project?.name || 'Projekt');
  }, [project, setTitle]);
    
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Laden...</div>;
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Projekt nicht gefunden</h1>
        <p className="mb-4">Das Projekt mit der ID {projectId} existiert nicht.</p>
        <Link to="/projects" className="text-blue-500 hover:underline">
          Zurück zur Projektübersicht
        </Link>
      </div>
    );
  }

  return (
      <SourceProvider projectId={projectId!}>
            <div className='flex flex-row gap-4 w-full h-full'>
                <SourcesCollapsableCard project={project} />
                <ChatCard project={project} />
                <StudioCollapsableCard project={project} />
            </div>
      </SourceProvider>
  );
};

export default ProjectPage;
