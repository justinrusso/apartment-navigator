import { fetchApi, routeBuilder } from "./util";

const propertiesRoute = routeBuilder("/api/units");

export class PropertyUnitsApi {
  static async getUnitCategories() {
    return fetchApi(propertiesRoute("/categories"));
  }
}

export interface PropertyUnitCategory {
  id: number;
  name: string;
}
