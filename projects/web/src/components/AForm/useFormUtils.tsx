import { type FormInstance } from "@arco-design/web-react";
import { type SetValueFn, type GetValueFn } from "./interfaceGetFieldType";

export const useFormUtils = <IFormData,>(form: FormInstance<IFormData>) => {
  return {
    getValue: form.getFieldValue as GetValueFn<IFormData>,
    setValue: form.setFieldValue as SetValueFn<IFormData>,
  };
};
