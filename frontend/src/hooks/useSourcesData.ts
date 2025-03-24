import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/provider/AuthProvider";
import { getSourcesByProjectRequest, getFileByIdRequest, processOcrRequest } from "@/services/ApiService";
import { Source as SourceType, File as FileType } from "@/types";

const useSourcesData = (projectId: string, options: { enabled?: boolean } = {}) => {
  const { enabled = true } = options;
  const { authToken } = useAuth();
  const [sources, setSources] = useState<SourceType[]>([]);
  const [files, setFiles] = useState<(FileType & { sourceId: string })[]>([]);

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

  // Fetch sources on mount or project changes when enabled
  useEffect(() => {
    if (enabled) {
      fetchSources();
    }
  }, [fetchSources, enabled]);

  // Fetch files and process sources when enabled
  useEffect(() => {
    if (!enabled) return;
    fetchFiles();

    // Process OCR on PDF sources using file type from files and update non-PDF sources
    const pdfSources = sources.filter((source) => {
      const fileType = files.find(file => file.file_id === source.source_file_id)?.type;
      return source.status === "uploaded" && fileType === "application/pdf";
    });
    pdfSources.forEach((source) => {
      processOcrRequest(authToken!, source.source_id);
    });

    // Update non-PDF sources to completed if file type is not PDF
    if (sources.some((source) => {
      const fileType = files.find(file => file.file_id === source.source_file_id)?.type;
      return source.status === "uploaded" && fileType !== "application/pdf";
    })) {
      setSources((prev) =>
        prev.map((source) => {
          const fileType = files.find(file => file.file_id === source.source_file_id)?.type;
          if (source.status === "uploaded" && fileType !== "application/pdf") {
            return {
              ...source,
              text_file_id: source.source_file_id,
              status: "completed",
            };
          }
          return source;
        })
      );
    }
  }, [fetchFiles, sources, authToken, enabled]);

  return { sources, files, fetchSources, fetchFiles };
};

export default useSourcesData;