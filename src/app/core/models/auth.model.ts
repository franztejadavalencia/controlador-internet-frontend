export interface JWTPayload {
  id_user: number;
  username: string;
  id_role: number;
  role_name: string;
  is_internal: boolean;
  iat: number;
  exp: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
