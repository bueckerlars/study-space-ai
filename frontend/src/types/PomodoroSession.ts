export interface PomodoroSession {
  pomodoro_id?: number;
  user_id: number;
  task_id: number;
  start_time: Date;
  end_time?: Date;
  duration?: number;
  created_at?: Date;
  updated_at?: Date;
}
