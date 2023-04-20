import { Input, Select, Switch, Radio } from "@arco-design/web-react";
import { type FC } from "react";
import { useSiteDrawerStore } from "./utils/useSiteDrawerStore";
import { useFormItem } from "@/components/AForm";
import { initSiteRouteConfig } from "./utils/initDatas";
import {
  optionsOfRouteMatchType,
  optionsOfRouteType,
} from "./utils/optionDatas";

import { AFormListCollapse } from "@/components/AForm/AFormListCollapse";
import { AFormWatch } from "@/components/AForm/AFormWatch";

export const PanelRoute: FC = () => {
  const { formIns, rootDir } = useSiteDrawerStore();
  const FI = useFormItem(formIns, {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
  });

  return (
    <AFormListCollapse
      form={formIns}
      field="routeConfig"
      itemsKeyName="id"
      onAdd={() => initSiteRouteConfig("Static")}
      addBtnText="添加路由"
      renderTitle={(field) => (
        <AFormWatch form={formIns} field={`${field}.path` as const}>
          {(path) => (path ? `路由：${path}` : "未设置路由")}
        </AFormWatch>
      )}
    >
      {(field, index) => (
        <>
          <FI
            field={`${field}.path` as const}
            label="路径"
            rules={[{ required: true }]}
          >
            <Input
              addBefore={
                <FI field={`${field}.matchType` as const} noStyle>
                  <Select
                    className="!w-[100px]"
                    options={optionsOfRouteMatchType}
                  />
                </FI>
              }
            />
          </FI>
          <FI
            field={`${field}.type` as const}
            label="功能选择"
            rules={[{ required: true }]}
          >
            <Radio.Group options={optionsOfRouteType} type="button" />
          </FI>

          <FI
            noStyle
            shouldUpdate={[`${field}.type`, `${field}.entryDir`, "homeDir"]}
          >
            {(formData) => {
              const entryDirPrefix = `${rootDir}/${
                formData.homeDir || "{未设置主目录}"
              }/`;
              const currentrRouteConfig = formData.routeConfig[index];
              const spaEntryFilePrefix =
                currentrRouteConfig.type === "Spa"
                  ? `${entryDirPrefix}${
                      currentrRouteConfig.entryDir || "{未设置入口目录}"
                    }/`
                  : "";

              const elementOfEntryDir = (
                <FI
                  field={`${field}.entryDir` as any}
                  label="入口目录"
                  rules={[{ required: true }]}
                >
                  <Input
                    css={`
                      input {
                        @apply !pl-0;
                      }
                    `}
                    placeholder=" 项目主目录路径"
                    prefix={entryDirPrefix}
                  />
                </FI>
              );

              switch (formData.routeConfig[index].type) {
                case "Static":
                  return (
                    <>
                      {elementOfEntryDir}
                      <FI
                        field={`${field}.canBrowse` as any}
                        label="允许浏览目录"
                      >
                        <Switch />
                      </FI>
                    </>
                  );
                case "Php":
                  return <>{elementOfEntryDir}</>;
                case "Spa":
                  return (
                    <>
                      {elementOfEntryDir}
                      <FI
                        field={`${field}.entryFile` as any}
                        label="入口html"
                        rules={[{ required: true }]}
                      >
                        <Input
                          css={`
                            input {
                              @apply !pl-0;
                            }
                          `}
                          prefix={spaEntryFilePrefix}
                        />
                      </FI>
                    </>
                  );
                case "ReverseProxy":
                  return (
                    <>
                      <FI
                        field={`${field}.reverseProxyUrl` as any}
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
                        field={`${field}.bindServiceId` as any}
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
      )}
    </AFormListCollapse>
  );
};
