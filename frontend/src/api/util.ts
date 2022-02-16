interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function fetchApi(
  url: string,
  options?: RequestOptions
): Promise<Response> {
  const revisedOptions = options || {};

  if (revisedOptions?.method?.toUpperCase() !== "GET") {
    if (!revisedOptions.headers) {
      revisedOptions.headers = {};
    }

    revisedOptions.headers["Content-Type"] =
      revisedOptions.headers["Content-Type"] || "application/json";

    // Since multipart is a bit unique, allow it to be created automatically
    if (revisedOptions.headers["Content-Type"] === "multipart/form-data") {
      delete revisedOptions.headers["Content-Type"];
    }
  }

  const res = await fetch(url, revisedOptions);

  if (res.status >= 400) {
    throw res;
  }

  return res;
}

/**
 *
 * @param basePath In the form of `/api/test`. There should not be a `/` at the end of the string!
 * @returns a builder function to create the full path
 */
export function routeBuilder(basePath: string) {
  return (path?: string): string => {
    if (!path || path === "/") {
      return basePath;
    }
    return `${basePath}${path}`;
  };
}

export function objectToFormData(data: Record<any, any>) {
  const formData = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      v.forEach((el) => {
        formData.append(k, el);
      });
    } else {
      formData.append(k, v);
    }
  });
  return formData;
}
