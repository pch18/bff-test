import {
  Form,
  type FormInstance,
  Button,
  Collapse,
  Popconfirm,
} from "@arco-design/web-react";
import { type ReactNode, useState } from "react";
import { type GetFieldType } from "./interfaceGetFieldType";
import { get } from "lodash-es";
import {
  IconArrowUp,
  IconArrowDown,
  IconDelete,
  IconPlus,
} from "@arco-design/web-react/icon";
import { useFormUtils } from "./useFormUtils";

export const FormListCollapse = <
  IFormData,
  FieldKey extends string,
  ItemsKey extends string
>(props: {
  form: FormInstance<IFormData>;
  field: GetFieldType<IFormData, FieldKey> extends any[] ? FieldKey : never;
  itemsKeyName: GetFieldType<
    IFormData,
    `${FieldKey}[${number}].${ItemsKey}`
  > extends undefined
    ? never
    : ItemsKey;
  renderContent: (
    index: number,
    field: `${FieldKey}[${number}]`,
    data: GetFieldType<IFormData, typeof field>
  ) => ReactNode;
  renderTitle: (
    index: number,
    field: `${FieldKey}[${number}]`,
    data: GetFieldType<IFormData, `${FieldKey}[${number}]`>
  ) => ReactNode;
  onAdd: () => GetFieldType<IFormData, `${FieldKey}[${number}]`>;
  addBtnText: string;
}) => {
  const {
    form,
    field,
    itemsKeyName,
    renderContent,
    renderTitle,
    onAdd,
    addBtnText,
  } = props;

  const fu = useFormUtils(form);
  const [collapseOpenKeys, setCollapseOpenKeys] = useState(() =>
    (fu.getValue as any)(field).map((r: any) => get(r, itemsKeyName))
  );

  return (
    <Form.List field="routeConfig">
      {(fields, { add, remove, move }) => (
        <>
          <Collapse
            activeKey={collapseOpenKeys}
            onChange={(_, keys) => {
              setCollapseOpenKeys(keys);
            }}
          >
            {fields.map((_, index) => {
              const fieldName = `${field}[${index}]` as const;
              const itemData = (fu.getValue as any)(fieldName);
              const itemKey = get(itemData, itemsKeyName);
              return (
                <Collapse.Item
                  key={itemKey}
                  name={itemKey}
                  css={`
                    .arco-collapse-item-header-title {
                      flex: auto;
                    }
                  `}
                  header={
                    <div className="w-full flex justify-between items-center">
                      <div>{renderTitle(index, fieldName, itemData)}</div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Button
                          type="text"
                          icon={<IconArrowUp />}
                          className="!p-0 !h-6 !w-6"
                          disabled={index === 0}
                          onClick={() => {
                            move(index, index - 1);
                          }}
                        />
                        <Button
                          type="text"
                          icon={<IconArrowDown />}
                          className="!p-0 !h-6 !w-6"
                          disabled={index === fields.length - 1}
                          onClick={() => {
                            move(index, index + 1);
                          }}
                        />
                        <Popconfirm
                          getPopupContainer={() => document.body}
                          title="确认要删除当前路由吗？"
                          onOk={() => {
                            remove(index);
                          }}
                        >
                          <Button
                            type="text"
                            icon={<IconDelete />}
                            className="!p-0 !h-6 !w-6"
                          />
                        </Popconfirm>
                      </div>
                    </div>
                  }
                >
                  {renderContent(index, fieldName, itemData)}
                </Collapse.Item>
              );
            })}
            <div className="w-full h-10">
              <Button
                type="text"
                className="w-full !h-full"
                icon={<IconPlus />}
                onClick={() => {
                  const newData = onAdd();
                  const newDataKey = get(newData, itemsKeyName);
                  setCollapseOpenKeys((k: any) => [...k, newDataKey]);
                }}
              >
                {addBtnText}
              </Button>
            </div>
          </Collapse>
        </>
      )}
    </Form.List>
  );
};
