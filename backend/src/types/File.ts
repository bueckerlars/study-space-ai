export interface File {
    file_id: string;
    user_id: number;
    project_id?: number; // Optional project association
    name: string;
    size: number;
    type: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
}