import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/provider/AuthProvider";
import { getSourcesByProjectRequest, getFileByIdRequest } from "@/services/ApiService";
import { Source as SourceType, File as FileType } from "@/types";

const useSourcesData = (projectId: string) => {
  const { authToken } = useAuth();
  const [sources, setSources] = useState<SourceType[]>([]);
  const [files, setFiles] = useState<FileType[]>([]);

  const fetchSources = useCallback(() => {
    if (!authToken) return;
    getSourcesByProjectRequest(authToken, projectId)
      .then(response => {
        setSources(response.data.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [authToken, projectId]);

  const fetchFiles = useCallback(async () => {
    if (!authToken || sources.length === 0) return;
    try {
      const filePromises = sources.map(source =>
        getFileByIdRequest(authToken, source.source_file_id!)
          .then(response => ({ ...response.data, sourceId: source.source_id }))
          .catch(error => {
            console.error(error);
            return null;
          })
      );
      const fileResults = await Promise.all(filePromises);
      setFiles(fileResults.filter(file => file !== null));
    } catch (error) {
      console.error("Error fetching files:", error);
      setFiles([]);
    }
  }, [authToken, sources]);

  // Fetch sources on mount or project changes
  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  // Fetch files when sources update
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return { sources, files, fetchSources, fetchFiles };
};

export default useSourcesData;