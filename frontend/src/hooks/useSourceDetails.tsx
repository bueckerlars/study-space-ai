import { useState } from "react";
import { getFileContentRequest, getSourceByIdRequest } from "@/services/ApiService";
import { Source } from "@/types";
import { useAuth } from "@/provider/AuthProvider";

const useSourceDetails = () => {
    const { authToken } = useAuth();
    const [summary, setSummary] = useState<string | null>(null);
    const [text, setText] = useState<string | null>(null);
    const [themes, setThemes] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSourceDetails = async (sourceId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getSourceByIdRequest(authToken!, sourceId);
            const source: Source = response.data.data;
            const jsonArray = source.themes;
            const stringArray: string[] = Array.isArray(jsonArray) 
                ? jsonArray.filter((item): item is string => typeof item === "string") 
                : [];
            setThemes(stringArray);

            const textResponse = await getFileContentRequest(authToken!, source.text_file_id!);
            setText(textResponse.data.content);

            const summaryResponse = await getFileContentRequest(authToken!, source.summary_file_id!);
            setSummary(summaryResponse.data.content);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        summary,
        text,
        themes,
        loading,
        error,
        fetchSourceDetails
    };
};

export default useSourceDetails;