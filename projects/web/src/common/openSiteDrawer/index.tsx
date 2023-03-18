import { Drawer, Tabs } from "@arco-design/web-react";
import { createNiceModal } from "../../utils/nicemodel";
import { PanelBasic } from "./PanelBasic";
import { PanelService } from "./PanelService";
import { PanelBuild } from "./PanelBuild";
import { type FC } from "react";
import {
  SiteDrawerStoreProvider,
  useSiteDrawerStore,
} from "./useSiteDrawerStore";

const SiteDrawer: FC = () => {
  const { _modal, isCreate } = useSiteDrawerStore();
  return (
    <Drawer
      {..._modal.props}
      onOk={() => {
        _modal.resolve();
      }}
      title={<span>站点信息</span>}
      className="min-w-[500px] !w-1/2"
    >
      <Tabs defaultActiveTab="base">
        <Tabs.TabPane key="base" title="基本">
          <PanelBasic />
        </Tabs.TabPane>

        <Tabs.TabPane key="build" title="构建" disabled={isCreate}>
          <PanelBuild />
        </Tabs.TabPane>

        <Tabs.TabPane key="service" title="服务" disabled={isCreate}>
          <PanelService />
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
};

export const openSiteDrawer = createNiceModal<
  { siteId: number; isCreate?: false } | { siteId?: undefined; isCreate: true },
  undefined
>(({ _modal, siteId, isCreate = false }) => {
  return (
    <SiteDrawerStoreProvider
      isCreate={isCreate}
      siteId={siteId}
      _modal={_modal}
    >
      <SiteDrawer />
    </SiteDrawerStoreProvider>
  );
});
