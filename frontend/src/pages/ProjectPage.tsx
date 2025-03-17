import AddSourcesDialog from '@/components/AddSourcesDialog';
import SourcesDataTable from '@/components/SourceDataTable/SourcesDataTable';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/provider/AuthProvider';
import { getProjectByIdRequest } from '@/services/ApiService';
import { Project } from '@/types';
import { SidebarIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';


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
    <div className='grid grid-cols-4 gap-4 h-full flex-1'>
      <div className='col-span-1 flex flex-col h-full'>
        <Card className='flex-grow flex flex-col px-4 w-full h-full min-h-0'>
          <CardHeader className='flex justify-between flex-row items-center'>
            <CardTitle >
              Sources
            </CardTitle>
          </CardHeader>
          <Separator />
          <div className="flex-grow overflow-auto">
            <div className="w-full flex justify-center ">
              <AddSourcesDialog projectName={project.name} />
            </div>
            <SourcesDataTable projectId={projectId!} />
          </div>
        </Card>
      </div>
      <div className='col-span-2 flex flex-col h-full'>
        <Card className='flex-grow flex flex-col w-full h-full min-h-0'>
          <CardHeader className="justify-between flex-row items-center flex">
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <Separator />
          <div className="flex-grow overflow-auto">
          </div>
        </Card>
      </div>
      <div className='col-span-1 flex flex-col h-full'>
        <Card className='flex-grow flex flex-col w-full h-full min-h-0'>
          <CardHeader className="justify-between flex-row items-center flex">
            <CardTitle>
              Studio
            </CardTitle>
          </CardHeader>
          <Separator />
          <div className="flex-grow overflow-auto">
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProjectPage;
