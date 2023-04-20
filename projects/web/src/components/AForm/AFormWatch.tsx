import { type FormInstance } from "@arco-design/web-react";
import { type ReactElement, type ReactNode } from "react";
import { type GetFieldType } from "./interfaceGetFieldType";

import { useFormWatch } from "./useFormWatch";

export const AFormWatch = <IFormData, FieldKey extends string>(props: {
  form: FormInstance<IFormData>;
  field: GetFieldType<IFormData, FieldKey> extends undefined ? never : FieldKey;
  children?: (input: GetFieldType<IFormData, FieldKey>) => ReactNode;
}) => {
  const { form, field, children } = props;
  const data = useFormWatch(form, field);
  return children ? <>{children(data)}</> : <span>{String(data)}</span>;
};
