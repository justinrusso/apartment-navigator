import { fetchApi, routeBuilder } from "./util";

const propertiesRoute = routeBuilder("/api/properties");

export interface PropertyCategoryData {
  id: number;
  name: string;
}

export async function getPropertyCategories() {
  return fetchApi(propertiesRoute("/categories"));
}
