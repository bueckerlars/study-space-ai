import AddSourcesDialog from '@/components/AddSourcesDialog';
import SourcesDataTable from '@/components/SourceDataTable/SourcesDataTable';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CollapsableCard, 
  CollapsableCardContent, 
  CollapsableCardHeader, 
  CollapsableCardSeparator, 
  CollapsableCardTitle, 
  CollapsableCardTrigger,
  useCollapsableCard
} from '@/components/ui/collapsable-card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/provider/AuthProvider';
import { getProjectByIdRequest } from '@/services/ApiService';
import { Project } from '@/types';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

// Header component that only renders when card is expanded
const ConditionalHeader: React.FC<{title: string}> = ({ title }) => {
  const { isCollapsed } = useCollapsableCard();
  
  if (isCollapsed) {
    return null;
  }
  
  return (
    <>
      <CollapsableCardHeader>
        <CollapsableCardTitle>{title}</CollapsableCardTitle>
      </CollapsableCardHeader>
      <CollapsableCardSeparator />
    </>
  );
};

const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { authToken } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate API call with timeout
    const fetchProject = () => {
      setLoading(true);
      
      getProjectByIdRequest(authToken!, parseInt(projectId!)).then((response) => {
        const project: Project = response.data;
        setProject(project);
        setLoading(false);
      }).catch((error) => {
        console.error(error);
        setLoading(false);
      });
    };

    fetchProject();
  }, []);

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
    <div className='flex flex-row gap-4 w-full h-full'>
      <CollapsableCard id="sources" defaultCollapsed={false} fullHeight maxWidth={400} className='flex-1'>
        <CollapsableCardTrigger />
        <ConditionalHeader title="Sources" />
        <CollapsableCardContent>
          <div className="w-full flex justify-center ">
            <AddSourcesDialog projectName={project.name} />
          </div>
          <SourcesDataTable projectId={projectId!} />
        </CollapsableCardContent>
      </CollapsableCard>
      <Card className='flex-col w-full h-full min-h-0 flex-2'>
        <CardHeader className="justify-between flex-row items-center">
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <Separator />
        <div className="flex-grow overflow-auto">
        </div>
      </Card>
      <CollapsableCard id="studio" defaultCollapsed={false} fullHeight maxWidth={400} className="flex-1">
        <CollapsableCardTrigger />
        <ConditionalHeader title="Studio" />
        <CollapsableCardContent>
          
        </CollapsableCardContent>
      </CollapsableCard>
    </div>
  );
};

export default ProjectPage;
