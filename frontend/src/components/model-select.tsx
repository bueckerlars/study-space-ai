import { useAuth } from "@/provider/AuthProvider";
import { getModelsRequest } from "@/services/ApiService";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";

const ModelSelect = () => {
    const { authToken } = useAuth();
    const [models, setModels] = useState<any[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>("");

    useEffect(() => {
        getModelsRequest(authToken!).then((response) => {
            const modelObjects = response.data.data.models;
            setModels(modelObjects);
            if (modelObjects.length > 0) {
                setSelectedModel(modelObjects[0].name);
            }
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    return (
        <Select onValueChange={(value) => setSelectedModel(value)}>
            <SelectTrigger disabled={models.length === 0} size="sm">
                {models.length === 0 ? "No Models" : selectedModel}
            </SelectTrigger>
            <SelectContent>
                {models.map((model) => (
                    <SelectItem key={model.name} value={model.name}>{model.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default ModelSelect;