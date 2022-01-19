import { fetchApi, routeBuilder } from "./util";

const authRoute = routeBuilder("/api/auth");

export interface UserData {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
}

export interface RegistrationData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company?: string;
}

export interface RegistrationErrors {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
}

export async function register(data: RegistrationData) {
  return fetchApi(authRoute("/register"), {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface LoginData {
  credentials: string;
  password: string;
}

export interface LoginErrors {
  credentials?: string;
  password?: string;
  invalid?: string;
}

export async function login(data: LoginData) {
  return fetchApi(authRoute("/login"), {
    method: "POST",
    body: JSON.stringify(data),
  });
}
