import { type FormInstance } from "@arco-design/web-react";
import { type FieldError } from "@arco-design/web-react/es/Form/interface";
import {
  type SetValueFn,
  type GetValueFn,
  type GetFieldType,
} from "./interfaceGetFieldType";

export const useFormUtils = <IFormData,>(form: FormInstance<IFormData>) => {
  return {
    getValue: form.getFieldValue as GetValueFn<IFormData>,
    setValue: form.setFieldValue as SetValueFn<IFormData>,
    getFieldError: form.getFieldError as FieldErrorFn<IFormData>,
  };
};

type FieldErrorFn<Data> = <K extends string, V extends GetFieldType<Data, K>>(
  key: V extends undefined ? never : K
) => FieldError<V> | null;
