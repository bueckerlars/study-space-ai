export interface User {
  user_id?: number;
  email: string;
  username: string;
  password: string;
  role: string;
  created_at?: Date;
  updated_at?: Date;
}
