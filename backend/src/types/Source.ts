export interface Source {
    source_id: string;
    status: string;
    project_id: string;
    created_at?: Date;
    updated_at?: Date;
    source_file_id?: string;
    text_file_id?: string;
    summary_file_id?: string;
    themes?: string[];
}