import { type FormInstance } from "@arco-design/web-react";
import { createPathGetter, replacePathGetter } from "../utils/pathGetter";

export const useFormUtils = <FormData,>(inputForm: FormInstance<FormData>) => {
  const form = inputForm;

  function getValue<GetData>(getFn: (formData: FormData) => GetData): GetData;
  function getValue<K extends keyof FormData>(key: K): FormData[K];
  function getValue(arg: any) {
    if (typeof arg === "string") {
      return form.getFieldValue(arg as any);
    } else if (typeof arg === "function") {
      return replacePathGetter(arg(createPathGetter()), (path) =>
        form.getFieldValue(path as any)
      );
    }
  }
  return {
    getValue,
  };
};
