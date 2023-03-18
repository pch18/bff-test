import {
  Form,
  type FormItemProps,
  type FormInstance,
} from "@arco-design/web-react";
import { get } from "lodash-es";
import { useCallback, type ReactElement } from "react";
import {
  type SetValueFn,
  type GetValueFn,
  type GetFieldType,
} from "./interfaceGetFieldType";

export const useFormItem = <Data,>(form: FormInstance<Data>) => {
  const FI: FI<Data> = useCallback((props) => {
    return (
      <Form.Item
        {...props}
        store={form as any}
        formatter={props.formatter as any}
        normalize={props.normalize as any}
      />
    );
  }, []);
  return FI;
};

type FI<IFormData> = <
  WidgetType,
  FieldKey extends string,
  FieldType = GetFieldType<IFormData, FieldKey>
>(
  props: Omit<FormItemProps, "formatter" | "normalize"> & {
    field: FieldType extends undefined ? never : FieldKey;
    /** 将 Form Field 的值进行一定的转换，再传递给控件。 */
    formatter?: (fieldValue: FieldType) => WidgetType;
    /** 将控件的 value 进行一定的转换再保存到 Form Field 中 */
    normalize?: (widgetValue: WidgetType) => FieldType;
  }
) => ReactElement;
