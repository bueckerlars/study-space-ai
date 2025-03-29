import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Source } from '../types/Source';
import { FileWithSource } from '../types/FileWithSource';
import { getSourcesByProjectRequest, getFileByIdRequest } from '../services/ApiService';
import { useAuth } from './AuthProvider';

interface SourceContextProps {
  sources: Source[];
  sourceFiles: FileWithSource[];
  loading: boolean;
  error: string | null;
  enabled: boolean;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  refetchCallback: () => Promise<void>;
}

const SourceContext = createContext<SourceContextProps | undefined>(undefined);

interface SourceProviderProps {
  children: ReactNode;
  projectId: string;
}

export const SourceProvider: React.FC<SourceProviderProps> = ({ children, projectId }) => {
  const { authToken } = useAuth();
  const [sources, setSources] = useState<Source[]>([]);
  const [sourceFiles, setSourceFiles] = useState<FileWithSource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [enabled, setEnabled] = useState<boolean>(true);

  const fetchSourcesAndFiles = useCallback(async () => {
    if (!authToken || !enabled) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch sources for the project
      const sourcesResponse = await getSourcesByProjectRequest(authToken, projectId);
      const fetchedSources: Source[] = sourcesResponse.data.data;
      setSources(fetchedSources);

      // Fetch source files linked to the sources
      const fetchedSourceFiles: FileWithSource[] = await Promise.all(
        fetchedSources.map(async (source) => {
          if (source.source_file_id) {
            const fileResponse = await getFileByIdRequest(authToken, source.source_file_id);
            return { file: fileResponse.data, source_id: source.source_id };
          }
          return null;
        })
      ).then((results) => results.filter((file) => file !== null) as FileWithSource[]);

      setSourceFiles(fetchedSourceFiles);
    } catch (err) {
      console.error('Failed to fetch sources or files:', err);
      setError('Failed to fetch sources or files.');
    } finally {
      setLoading(false);
    }
  }, [authToken, projectId, enabled]);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(fetchSourcesAndFiles, 5000);
    fetchSourcesAndFiles(); // Initial fetch

    return () => clearInterval(interval);
  }, [fetchSourcesAndFiles, enabled]);

  return (
    <SourceContext.Provider value={{ sources, sourceFiles, loading, error, enabled, setEnabled, refetchCallback: fetchSourcesAndFiles }}>
      {children}
    </SourceContext.Provider>
  );
};

export const useSource = (): SourceContextProps => {
  const context = useContext(SourceContext);
  if (!context) {
    throw new Error('useSource must be used within a SourceProvider');
  }
  return context;
};

