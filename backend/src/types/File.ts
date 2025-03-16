export interface File {
    file_id: string;
    user_id: number;
    project_id: number;
    name: string;
    size: number;
    type: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
}