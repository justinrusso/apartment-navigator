import { UserData } from "./auth";
import { fetchApi, routeBuilder } from "./util";

const propertiesRoute = routeBuilder("/api/properties");

export interface PropertyCategoryData {
  id: number;
  name: string;
}

export async function getPropertyCategories() {
  return fetchApi(propertiesRoute("/categories"));
}

export class PropertiesApi {
  static async createProperty(data: CreatePropertyData) {
    return fetchApi(propertiesRoute(), {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async getProperties() {
    return fetchApi(propertiesRoute());
  }
}

export interface CreatePropertyData {
  name?: string;
  address1: string;
  address2?: string;
  builtInYear: string;
  categoryId: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PropertiesApiData {
  properties: PropertyApiData[];
}

export interface PropertyImage {
  id: number;
  propertyId: number;
  unitId?: number;
  url: string;
}

export interface PropertyUnit {
  id: number;
  propertyId: number;
  unitCategory: UnitCategory;
  baths: number;
  price: number;
  sqFt: number;
  images: PropertyImage[];
  floorPlanImg: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyApiData {
  id: number;
  owner: UserData;
  category: PropertyCategoryData;
  builtInYear: number;
  name?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  images: PropertyImage[];
  units: PropertyUnit[];
  createdAt: string;
  updatedAt: string;
}

export interface UnitCategory {
  id: number;
  name: string;
}
