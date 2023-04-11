import {
  Collapse,
  Form,
  Input,
  Button,
  Divider,
  Select,
} from "@arco-design/web-react";
import { type FC } from "react";
import { useSiteDrawerStore } from "./utils/useSiteDrawerStore";
import { useFormItem, useFormUtils, useFormWatch } from "@/components/AForm";
import { initSiteRouteConfig, type SiteRouteConfig } from "./utils/initDatas";
import { optionsOfRouteMatchType } from "./utils/optionDatas";
import { IconPlus } from "@arco-design/web-react/icon";

export const PanelRoute: FC = () => {
  const { formIns } = useSiteDrawerStore();

  const serviceList = useFormWatch(formIns, "routeConfig");

  return (
    <Form.List field="routeConfig">
      {(fields, { add, remove, move }) => (
        <>
          <Collapse>
            {fields.map((item, index) => (
              <Collapse.Item
                key={item.key}
                name={item.field}
                header={
                  serviceList[index].path
                    ? `路径：${serviceList[index].path}`
                    : "未设置路径"
                }
              >
                <Item index={index} />
              </Collapse.Item>
            ))}
            <div className="w-full h-10">
              <Button
                type="text"
                className="w-full !h-full"
                icon={<IconPlus />}
                onClick={() => {
                  add(initSiteRouteConfig("Static"));
                }}
              >
                新增路由
              </Button>
            </div>
          </Collapse>
        </>
      )}
    </Form.List>
  );
};

const Item: FC<{
  index: number;
}> = ({ index }) => {
  const { formIns } = useSiteDrawerStore();
  const FI = useFormItem(formIns, {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  });

  return (
    <>
      <FI
        field={`routeConfig[${index}].path` as const}
        label="路径"
        rules={[{ required: true }]}
      >
        <Input
          addAfter={
            <FI field={`routeConfig[${index}].matchType` as const} noStyle>
              <Select
                style={{ width: 100 }}
                options={optionsOfRouteMatchType}
              />
            </FI>
          }
        />
      </FI>
    </>
  );
};
