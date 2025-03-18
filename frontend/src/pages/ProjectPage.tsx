import ChatCard from '@/components/ChatCard';
import SourcesCollapsableCard from '@/components/SourcesCollapsableCard';
import StudioCollapsableCard from '@/components/StudioCollapsableCard';
import { useAuth } from '@/provider/AuthProvider';
import { getProjectByIdRequest } from '@/services/ApiService';
import { Project } from '@/types';
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
    <div className='flex flex-row gap-4 w-full h-full'>
      <SourcesCollapsableCard project={project} />
      <ChatCard project={project} />
      <StudioCollapsableCard project={project} />
    </div>
  );
};

export default ProjectPage;
