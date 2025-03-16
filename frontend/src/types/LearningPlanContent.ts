export interface LearningPlanContent {
  content_id?: number;
  learning_plan_id: number;
  title: string;
  url?: string;
  order?: number;
  created_at?: Date;
  updated_at?: Date;
}
