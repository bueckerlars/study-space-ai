import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project } from '../types/Project';
import { getProjectByIdRequest } from '../services/ApiService';
import { useAuth } from './AuthProvider';
import { useParams } from 'react-router-dom';

interface ProjectContextProps {
  project: Project | null;
  loading: boolean;
  error: string | null;
}

const ProjectContext = createContext<ProjectContextProps | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
    const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchProject = async () => {
      if (authToken) {
        setLoading(true);
        setError(null);
        try {
          const response = await getProjectByIdRequest(authToken, projectId!);
          const project: Project = response.data;
          setProject(project);
        } catch (error) {
          console.error('Failed to fetch project:', error);
          setError('Failed to fetch project.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProject();
  }, [projectId, authToken]);

  return (
    <ProjectContext.Provider value={{ project, loading, error }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextProps => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};