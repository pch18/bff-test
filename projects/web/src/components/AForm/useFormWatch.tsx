import { type FormInstance } from "@arco-design/web-react";
import useWatch from "@arco-design/web-react/es/Form/hooks/useWatch";
import { type GetFieldType } from "./interfaceGetFieldType";

export const useFormWatch = <IFormData, FieldKey extends string>(
  form: FormInstance<IFormData>,
  field: GetFieldType<IFormData, FieldKey> extends undefined ? never : FieldKey
): GetFieldType<IFormData, FieldKey> => {
  return useWatch(field, form as any);
};
