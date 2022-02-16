import { fetchApi, routeBuilder } from "./utils";

const imagesRoute = routeBuilder("/api/images");

export class ImagesApi {
  static async deleteImage(imageId: number | string) {
    return fetchApi(imagesRoute(`/${imageId}`), {
      method: "DELETE",
    });
  }
}
