import { type FormInstance } from "@arco-design/web-react";
import { get } from "lodash-es";
import { type SetValueFn, type GetValueFn } from "./interfaceGetFieldType";

export const useFormUtils = <Data,>(form: FormInstance<Data>) => {
  return {
    getValue: form.getFieldValue as GetValueFn<Data>,
    setValue: form.setFieldValue as SetValueFn<Data>,
  };
};
