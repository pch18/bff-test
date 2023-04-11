import { type FormInstance } from "@arco-design/web-react";
import useForm from "@arco-design/web-react/es/Form/useForm";
import { useRef } from "react";
import { type SetValueFn, type GetValueFn } from "./interfaceGetFieldType";

export const useFormInstance = <IFormData,>(
  initialData: IFormData | (() => IFormData)
) => {
  const [form] = useForm<IFormData>();
  const isInitialed = useRef(false);
  if (!isInitialed.current) {
    const innerMethods = form.getInnerMethods(true);
    const initData =
      typeof initialData === "function" ? (initialData as any)() : initialData;
    innerMethods.innerSetInitialValues(initData);
    isInitialed.current = true;
  }
  return form;
};
