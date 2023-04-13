import {
  Collapse,
  Form,
  Input,
  Button,
  Divider,
  Select,
  Popconfirm,
  Switch,
  Radio,
} from "@arco-design/web-react";
import { useState, type FC } from "react";
import { useSiteDrawerStore } from "./utils/useSiteDrawerStore";
import { useFormItem, useFormUtils, useFormWatch } from "@/components/AForm";
import { initSiteRouteConfig, type SiteRouteConfig } from "./utils/initDatas";
import {
  optionsOfRouteMatchType,
  optionsOfRouteType,
} from "./utils/optionDatas";
import {
  IconArrowDown,
  IconArrowUp,
  IconDelete,
  IconMinus,
  IconPlus,
} from "@arco-design/web-react/icon";

export const PanelRoute: FC = () => {
  const { formIns, fu } = useSiteDrawerStore();

  const serviceList = useFormWatch(formIns, "routeConfig");

  const [collapseOpenKeys, setCollapseOpenKeys] = useState(() =>
    fu.getValue("routeConfig").map((r) => r.id)
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
            {fields.map((_, index) => (
              <Collapse.Item
                key={serviceList[index].id}
                name={serviceList[index].id}
                css={`
                  .arco-collapse-item-header-title {
                    flex: auto;
                  }
                `}
                header={
                  <div className="w-full flex justify-between items-center">
                    <div>
                      {serviceList[index].path
                        ? `路径：${serviceList[index].path}`
                        : "未设置路径"}
                    </div>
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
                        disabled={index === serviceList.length - 1}
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
                <Item index={index} />
              </Collapse.Item>
            ))}
            <div className="w-full h-10">
              <Button
                type="text"
                className="w-full !h-full"
                icon={<IconPlus />}
                onClick={() => {
                  const newRoute = initSiteRouteConfig("Static");
                  add(newRoute);
                  setCollapseOpenKeys((k) => [...k, newRoute.id]);
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
  const { formIns, fu, rootDir } = useSiteDrawerStore();
  const FI = useFormItem(formIns, {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  });
  // const type = useFormWatch(formIns, `routeConfig[${index}].type`);

  return (
    <>
      <FI
        field={`routeConfig[${index}].path` as const}
        label="路径"
        rules={[{ required: true }]}
      >
        <Input
          addBefore={
            <FI field={`routeConfig[${index}].matchType` as const} noStyle>
              <Select
                className="!w-[100px]"
                options={optionsOfRouteMatchType}
              />
            </FI>
          }
        />
      </FI>
      <FI
        field={`routeConfig[${index}].type` as const}
        label="服务选择"
        rules={[{ required: true }]}
      >
        <Radio.Group options={optionsOfRouteType} type="button" />
      </FI>
      <FI
        noStyle
        shouldUpdate={[`routeConfig[${index}].type`, "homeDir"]}
        // shouldUpdate={(p, n) =>
        //   p.routeConfig[index].type !== n.routeConfig[index].type
        // }
      >
        {(formData) => {
          switch (formData.routeConfig[index].type) {
            case "Static":
              return (
                <>
                  <FI
                    field={`routeConfig[${index}].entryDir` as any}
                    label="入口目录"
                    rules={[{ required: true }]}
                  >
                    <Input
                      css={`
                        input {
                          @apply !pl-0;
                        }
                      `}
                      placeholder="  项目主目录路径"
                      prefix={`${rootDir}/${formData.homeDir || "{未设置}"}/`}
                    />
                  </FI>
                  <FI
                    field={`routeConfig[${index}].canBrowse` as any}
                    label="允许浏览目录"
                  >
                    <Switch />
                  </FI>
                </>
              );
            case "Php":
              return (
                <>
                  <FI
                    field={`routeConfig[${index}].entryDir` as any}
                    label="入口目录"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </FI>
                </>
              );
            case "Spa":
              return (
                <>
                  <FI
                    field={`routeConfig[${index}].entryDir` as any}
                    label="入口目录"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </FI>
                  <FI
                    field={`routeConfig[${index}].entryFile` as any}
                    label="入口html"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </FI>
                </>
              );
            case "ReverseProxy":
              return (
                <>
                  <FI
                    field={`routeConfig[${index}].reverseProxyUrl` as any}
                    label="目标地址"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </FI>
                </>
              );
            case "BindService":
              return (
                <>
                  <FI
                    field={`routeConfig[${index}].bindServiceId` as any}
                    label="服务设置"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </FI>
                </>
              );
          }
        }}
      </FI>
    </>
  );
};
