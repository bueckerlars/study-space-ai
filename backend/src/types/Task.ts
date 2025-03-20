export interface Task {
  task_id?: number;
  user_id: number;
  project_id?: string;
  deadline_id?: number;
  title: string;
  description?: string;
  is_completed?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
