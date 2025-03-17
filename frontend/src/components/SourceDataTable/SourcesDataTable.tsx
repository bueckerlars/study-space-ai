import { DataTable } from "../ui/data-table";
import { useEffect, useState } from "react";
import { SourceDataTableColumns } from "./SourceDataTableColumns";
import { File as FileType } from "@/types";
import { getFilesByProjectRequest } from "@/services/ApiService";
import { useAuth } from "@/provider/AuthProvider";
import { FileIcon } from "lucide-react";

interface SourcesDataTableProps {
    projectId: string;
}

const SourcesDataTable = ({ projectId }: SourcesDataTableProps) => {   
    const { authToken } = useAuth();
    const [data, setData] = useState<FileType[]>([]);

    useEffect(() => {
        getFilesByProjectRequest(authToken!, parseInt(projectId)).then((response) => {
            const data: FileType[] = response.data;
            setData(data);
        }).catch((error) => {
            console.error(error);
        });
    }, [authToken, projectId]);

    return(
        <>
            {data.length > 0 && (
                <DataTable columns={SourceDataTableColumns} data={data} showHeader={false}/>
            ) || (
                <div className="flex justify-center items-center h-40 flex-col gap-2 text-gray-400 h-full">
                    <FileIcon size={40}/>
                    <p className="text-center">
                        Saved sources are displayed here
                        Click on 'Add Sources' at the top to add PDFs or texts. 
                    </p>
                </div>
            )
            
            }
        </>
    );
}

export default SourcesDataTable;