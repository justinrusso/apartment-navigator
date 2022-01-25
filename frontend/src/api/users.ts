import { fetchApi, routeBuilder } from "./util";

const usersRoute = routeBuilder("/api/users");

export class UsersApi {
  static async getUserOwnedProperties() {
    return fetchApi(usersRoute("/properties"));
  }
}
