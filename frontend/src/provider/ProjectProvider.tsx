import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project } from '../types/Project';
import { getProjectByIdRequest } from '../services/ApiService';
import { useAuth } from './AuthProvider';

interface ProjectContextProps {
  project: Project | null;
  projectId: string | null;
  setProjectId: (id: string | null) => void;
  loading: boolean;
  error: string | null;
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  refetchProject: () => void;
}

const ProjectContext = createContext<ProjectContextProps | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
  initialProjectId?: string;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children, initialProjectId }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [projectId, setProjectId] = useState<string | null>(initialProjectId || null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [enabled, setEnabled] = useState<boolean>(true);
  const { authToken } = useAuth();

  const fetchProject = async () => {
    if (authToken && projectId) {
      setLoading(true);
      setError(null);
      try {
        const response = await getProjectByIdRequest(authToken, projectId);
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

  useEffect(() => {
    fetchProject();
  }, [projectId, authToken]);

  useEffect(() => {
    if (enabled) {
      const interval = setInterval(() => {
        fetchProject();
      }, 60000); // Fetch every 60 seconds

      return () => clearInterval(interval);
    }
  }, [enabled, projectId, authToken]);

  return (
    <ProjectContext.Provider
      value={{
        project,
        projectId,
        setProjectId,
        loading,
        error,
        enabled,
        setEnabled,
        refetchProject: fetchProject,
      }}
    >
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