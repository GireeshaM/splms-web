import { LoginCredentials } from "./login-credentials.interface";

export interface LoginResponse {
  id: any;
    token: string;
  user: LoginCredentials;
  }