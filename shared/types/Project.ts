export interface Project {
  project_id?: number;
  user_id: number;
  module_id?: number;
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}
