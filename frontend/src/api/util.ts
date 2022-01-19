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
