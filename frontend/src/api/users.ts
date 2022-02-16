import { fetchApi, routeBuilder } from "./utils";

const usersRoute = routeBuilder("/api/users");

export class UsersApi {
  static async getUserOwnedProperties() {
    return fetchApi(usersRoute("/properties"));
  }
}
