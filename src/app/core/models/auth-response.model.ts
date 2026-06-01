import { UserSession } from "./user-session.model";

export interface AuthResponse {
  status: 'SUCCESS' | 'ERROR';
  access_token: string;
  user: UserSession;
}
