import { fetchApi, routeBuilder } from "./utils";

const unitsRoute = routeBuilder("/api/units");

export class PropertyUnitsApi {
  static async getUnitCategories() {
    return fetchApi(unitsRoute("/categories"));
  }

  static async updateUnit(
    unitId: number | string,
    data: UpdatePropertyUnitData
  ) {
    return fetchApi(unitsRoute(`/${unitId}`), {
      method: "PATCH",
      body: JSON.stringify(data),
    });
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

export interface CreatePropertyUnitData {
  unitNum: string;
  unitCategoryId: string;
  baths: string;
  price: string;
  sqFt: string;
  floorPlanImg: string;
}

export interface UpdatePropertyUnitData
  extends Partial<CreatePropertyUnitData> {}

export interface UnitFormErrors {
  unitNum: string[];
  unitCategoryId: string[];
  baths: string[];
  price: string[];
  sqFt: string[];
  floorPlanImg: string[];
}
