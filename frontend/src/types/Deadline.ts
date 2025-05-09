export interface Deadline {
  deadline_id?: number;
  user_id: number;
  project_id?: string;
  title: string;
  description?: string;
  due_date: Date;
  created_at?: Date;
  updated_at?: Date;
}
