import { Options as OriginalOptions } from "object-to-formdata";

/*
    Modified version of object-to-form-data
    https://github.com/therealparmesh/object-to-formdata

    Formats data that works with WTForms
*/

type Serializable = Record<any, any> | any[] | Date | boolean;
type Options = Omit<OriginalOptions, "dotsForObjectNotation" | "indices">;

function isUndefined(value: any) {
  return value === undefined;
}

function isNull(value: any) {
  return value === null;
}

function isBoolean(value: any) {
  return typeof value === "boolean";
}

function isObject(value: any) {
  return value === Object(value);
}

function isArray(value: any) {
  return Array.isArray(value);
}

function isDate(value: any) {
  return value instanceof Date;
}

function isBlob(value: any, isReactNative: boolean) {
  return isReactNative
    ? isObject(value) && !isUndefined(value.uri)
    : isObject(value) &&
        typeof value.size === "number" &&
        typeof value.type === "string" &&
        typeof value.slice === "function";
}

function isFile(value: any, isReactNative: boolean) {
  return (
    isBlob(value, isReactNative) &&
    typeof value.name === "string" &&
    (isObject(value.lastModifiedDate) || typeof value.lastModified === "number")
  );
}

function initCfg(value?: boolean) {
  return isUndefined(value) ? false : value;
}

export function serialize(
  obj: Serializable,
  options: Options = {},
  formData: FormData = new FormData(),
  keyPrefix: string = ""
) {
  options.nullsAsUndefineds = initCfg(options.nullsAsUndefineds);
  options.booleansAsIntegers = initCfg(options.booleansAsIntegers);
  options.allowEmptyArrays = initCfg(options.allowEmptyArrays);
  options.noFilesWithArrayNotation = initCfg(options.noFilesWithArrayNotation);

  const isReactNative = typeof (formData as any).getParts === "function";

  if (isUndefined(obj)) {
    return formData;
  } else if (isNull(obj)) {
    if (!options.nullsAsUndefineds) {
      formData.append(keyPrefix, "");
    }
  } else if (isBoolean(obj)) {
    if (options.booleansAsIntegers) {
      formData.append(keyPrefix, obj ? "1" : "0");
    } else {
      formData.append(keyPrefix, String(obj as boolean));
    }
  } else if (isArray(obj)) {
    if ((obj as any[]).length) {
      (obj as any[]).forEach((value, index) => {
        let key = `${keyPrefix}-${index}`;

        if (options.noFilesWithArrayNotation && isFile(value, isReactNative)) {
          key = keyPrefix;
        }

        serialize(value, options, formData, key);
      });
    } else if (options.allowEmptyArrays) {
      formData.append(keyPrefix, "");
    }
  } else if (isDate(obj)) {
    formData.append(keyPrefix, (obj as Date).toISOString());
  } else if (isObject(obj) && !isBlob(obj, isReactNative)) {
    Object.keys(obj as Record<any, any>).forEach((prop) => {
      const value = (obj as Record<any, any>)[prop];

      //   if (isArray(value)) {
      //     while (prop.length > 2 && prop.lastIndexOf("[]") === prop.length - 2) {
      //       prop = prop.substring(0, prop.length - 2);
      //     }
      //   }

      const key = keyPrefix ? `${keyPrefix}-${prop}` : prop;

      serialize(value, options, formData, key);
    });
  } else {
    formData.append(keyPrefix, obj as Blob);
  }

  return formData;
}
