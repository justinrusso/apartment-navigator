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

export interface SignupData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company?: string;
}

export interface SignupErrors {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
}

export async function signup(data: SignupData) {
  return fetchApi(authRoute("/signup"), {
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

export async function loginDemo() {
  return fetchApi(authRoute("/login/demo"));
}
