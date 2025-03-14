export interface LearningPlan {
  learning_plan_id?: number;
  user_id: number;
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}
