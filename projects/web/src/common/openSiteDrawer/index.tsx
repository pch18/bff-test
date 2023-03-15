import { Drawer, Tabs } from "@arco-design/web-react";
import { createNiceModal } from "../../utils/nicemodel";
import { useRequest } from "ahooks";
import { FormBasic } from "./FormBasic";
import { FormService } from "./FormService";
import { type SiteFormBasic } from "./interface";

interface SiteInfo {
  id: number;
  siteKey: string;
}

export const openSiteDrawer = createNiceModal<
  | { siteKey: string; isCreate?: false }
  | { siteKey?: undefined; isCreate: true },
  { siteFormBasic: SiteFormBasic }
>(({ _modal, siteKey, isCreate = false }) => {
  const { data: siteInfo } = useRequest(async () => {
    if (siteKey) {
      return {
        id: 1,
        siteKey: siteKey + "++++",
      };
    } else {
      return undefined;
    }
  }, {});

  return (
    <Drawer
      {..._modal.props}
      onOk={() => {
        _modal.resolve({
          siteFormBasic: {} as any,
        });
      }}
      title={<span>站点信息</span>}
      className="min-w-[500px] !w-1/2"
    >
      <Tabs defaultActiveTab="base">
        <Tabs.TabPane key="base" title="基本">
          <FormBasic isCreate={isCreate} />
        </Tabs.TabPane>

        <Tabs.TabPane key="build" title="构建" disabled={isCreate}>
          <FormService />
        </Tabs.TabPane>

        <Tabs.TabPane key="service" title="服务" disabled={isCreate}>
          服务配置
        </Tabs.TabPane>

        <Tabs.TabPane key="cert" title="证书" disabled={isCreate}>
          证书配置
        </Tabs.TabPane>

        <Tabs.TabPane key="rewrite" title="伪静态" disabled={isCreate}>
          Rewrite
        </Tabs.TabPane>

        <Tabs.TabPane key="caddy" title="配置预览" disabled={isCreate}>
          配置预览
        </Tabs.TabPane>
      </Tabs>
    </Drawer>
  );
});
