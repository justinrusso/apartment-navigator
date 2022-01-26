import { Draft } from "immer";
import { useState } from "react";
import { useImmer } from "use-immer";

const buildPrestineDefault = <T extends { [key: string]: any }>(
  defaults: T
): Record<keyof T, boolean> => {
  const result: Record<string, boolean> = {};

  Object.keys(defaults).forEach((key) => (result[key] = true));

  return result as Record<keyof T, boolean>;
};

function _getChangedFields<T extends Record<string, any>>(
  prestineState: Record<string, boolean>,
  data: T
): Partial<T> {
  const result: Record<string, any> = {};

  Object.entries(prestineState).forEach(([key, isPrestine]) => {
    if (!isPrestine) {
      result[key] = data[key];
    }
  });

  return result as Partial<T>;
}

const useFormFields = <T extends { [key: string]: any }>(defaults: T) => {
  const [fields, setFields] = useImmer(defaults);
  const [prestineFields, setPrestineFields] = useImmer(
    buildPrestineDefault(defaults)
  );
  const [isPrestine, setIsPrestine] = useState(true);

  const setField = (field: keyof T, newValue: any) => {
    setFields((draft) => {
      draft[field as keyof Draft<T>] = newValue;
    });

    if (prestineFields[field]) {
      setPrestineFields((draft) => {
        draft[field as keyof Draft<typeof prestineFields>] = false as any;
      });
    }

    if (isPrestine) {
      setIsPrestine(false);
    }
  };

  const getChangedFields = () => {
    return _getChangedFields(prestineFields, fields);
  };

  return {
    fields,
    getChangedFields,
    prestine: isPrestine,
    prestineFields,
    setField,
  };
};

export default useFormFields;
