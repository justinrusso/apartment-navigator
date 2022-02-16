import { UserData } from "./auth";
import { EditableReviewData, ReviewSummary } from "./reviews";
import { CreatePropertyUnitData, UnitFormErrors } from "./units";
import { fetchApi, objectToFormData, routeBuilder } from "./util";

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
      body: objectToFormData(data),
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  static async getProperties(searchParams?: URLSearchParams) {
    return fetchApi(
      searchParams
        ? propertiesRoute(`?${searchParams.toString()}`)
        : propertiesRoute()
    );
  }

  static async getProperty(propertyId: number | string) {
    return fetchApi(propertiesRoute(`/${propertyId}`));
  }
  static async updateProperty(
    propertyId: number | string,
    data: UpdatePropertyData
  ) {
    return fetchApi(propertiesRoute(`/${propertyId}`), {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async deleteProperty(propertyId: number | string) {
    return fetchApi(propertiesRoute(`/${propertyId}`), {
      method: "DELETE",
    });
  }

  static async createPropertyImage(
    propertyId: number | string,
    data: CreatePropertyImageData
  ) {
    return fetchApi(propertiesRoute(`/${propertyId}/images`), {
      method: "POST",
      body: objectToFormData(data),
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  static async createPropertyUnit(
    propertyId: number | string,
    data: CreatePropertyUnitData
  ) {
    return fetchApi(propertiesRoute(`/${propertyId}/units`), {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async getPropertyReviews(propertyId: number | string) {
    return fetchApi(propertiesRoute(`/${propertyId}/reviews`));
  }

  static async createPropertyReview(
    propertyId: number | string,
    data: EditableReviewData
  ) {
    return fetchApi(propertiesRoute(`/${propertyId}/reviews`), {
      method: "POST",
      body: JSON.stringify(data),
    });
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
  images?: File[];
  units?: CreatePropertyUnitData[];
}

export interface UpdatePropertyData
  extends Partial<Omit<CreatePropertyData, "images" | "units">> {}

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
  unitNum?: string;
  unitCategory: UnitCategory;
  baths: number;
  price: {
    id: number;
    propertyId: number;
    unitCategoryId: number;
    price: number;
    sqFt: number;
    createdAt: string;
  };
  sqFt: number;
  images: PropertyImage[];
  floorPlanImg?: string;
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
  lat: number;
  lng: number;
  reviewSummary: ReviewSummary;
  images: PropertyImage[];
  units: PropertyUnit[];
  createdAt: string;
  updatedAt: string;
}

export interface UnitCategory {
  id: number;
  name: string;
}

export interface CreatePropertyImageData {
  image: File;
}

export interface PropertyFormErrors {
  name?: string[];
  address1?: string[];
  address2?: string[];
  city?: string[];
  state?: string[];
  zipCode?: string[];
  images?: Record<number, string[]>;
  units?: Record<number, UnitFormErrors>;
  builtInYear?: string[];
  categoryId?: string[];
}
