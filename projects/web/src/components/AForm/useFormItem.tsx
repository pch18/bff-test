import {
  Form,
  type FormItemProps,
  type FormInstance,
} from "@arco-design/web-react";
import { useCallback, type ReactElement } from "react";
import { type GetFieldType } from "./interfaceGetFieldType";
import { get } from "lodash-es";

export const useFormItem = <IFormData,>(
  form: FormInstance<IFormData>,
  defaultProps: Partial<Parameters<FI<IFormData>>[0]> = {}
) => {
  const FI: FI<IFormData> = useCallback(
    ({ input, output, shouldUpdate, ...props }) => {
      return (
        <Form.Item
          {...defaultProps}
          {...props}
          store={form as any}
          formatter={input as any}
          normalize={output as any}
          shouldUpdate={
            Array.isArray(shouldUpdate)
              ? (p, n) =>
                  shouldUpdate.some((field) => get(p, field) !== get(n, field))
              : (shouldUpdate as any)
          }
        />
      );
    },
    []
  );
  return FI;
};

type FI<IFormData> = <FieldKey extends string, WidgetType>(
  props: Omit<
    FormItemProps,
    "formatter" | "normalize" | "children" | "shouldUpdate"
  > & {
    /** 字段 */
    field?: GetFieldType<IFormData, FieldKey> extends undefined
      ? never
      : FieldKey;
    /** 将 Form Field 的值进行一定的转换，再传递给组件 value 。 */
    input?: (fieldValue: GetFieldType<IFormData, FieldKey>) => WidgetType;
    /** 将控件的 value 进行一定的转换再保存到 Form Field 中 */
    output?: (widgetValue: WidgetType) => GetFieldType<IFormData, FieldKey>;
    shouldUpdate?:
      | boolean
      | string[]
      | ((prev: IFormData, next: IFormData) => boolean);

    children?: React.ReactNode | ((data: IFormData) => React.ReactNode);
  }
) => ReactElement;
