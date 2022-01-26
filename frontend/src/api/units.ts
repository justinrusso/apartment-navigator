import { fetchApi, routeBuilder } from "./util";

const unitsRoute = routeBuilder("/api/units");

export class PropertyUnitsApi {
  static async getUnitCategories() {
    return fetchApi(unitsRoute("/categories"));
  }

  static async deleteUnit(unitId: number) {
    return fetchApi(unitsRoute(`/${unitId}`), {
      method: "DELETE",
    });
  }
}

export interface PropertyUnitCategory {
  id: number;
  name: string;
}
