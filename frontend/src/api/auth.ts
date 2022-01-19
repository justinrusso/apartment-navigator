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
  firstName: string;
  lastName: string;
  company?: string;
}

export async function register(data: RegistrationData) {
  return fetchApi(authRoute("/register"), {
    method: "POST",
    body: JSON.stringify(data),
  });
}
