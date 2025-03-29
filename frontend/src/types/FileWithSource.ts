import { File as FileType } from './File';

export interface FileWithSource {
    file: FileType;
    source_id: string;
}