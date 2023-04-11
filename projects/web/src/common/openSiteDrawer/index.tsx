import { Drawer, Form, Tabs } from "@arco-design/web-react";
import { createNiceModal } from "../../utils/nicemodel";
import { PanelBasic } from "./PanelBasic";
import { PanelRoute } from "./PanelRoute";
// import { PanelService } from "./PanelService";
import { type FC } from "react";
import {
  SiteDrawerStoreProvider,
  useSiteDrawerStore,
} from "./utils/useSiteDrawerStore";

const SiteDrawer: FC = () => {
  const { _modal, isCreate, siteId, formIns } = useSiteDrawerStore();
  return (
    <Drawer
      {..._modal.props}
      onOk={() => {
        if (siteId) {
          _modal.resolve({ siteId });
        } else {
          _modal.resolve({ siteId: 123 });
        }
      }}
      title={<span>站点信息</span>}
      className="min-w-[500px] !w-1/2"
    >
      <Form form={formIns}>
        <Tabs defaultActiveTab="service">
          <Tabs.TabPane key="base" title="基本">
            <PanelBasic />
          </Tabs.TabPane>

          <Tabs.TabPane key="route" title="路由" disabled={isCreate}>
            <PanelRoute />
          </Tabs.TabPane>

          <Tabs.TabPane key="service" title="服务" disabled={isCreate}>
            {/* <PanelService /> */}
          </Tabs.TabPane>

          <Tabs.TabPane key="cert" title="证书" disabled={isCreate}>
            证书配置
          </Tabs.TabPane>

          <Tabs.TabPane key="rewrite" title="地址重写" disabled={isCreate}>
            Rewrite
          </Tabs.TabPane>

          <Tabs.TabPane key="caddy" title="配置预览" disabled={isCreate}>
            配置预览
          </Tabs.TabPane>
        </Tabs>
      </Form>
    </Drawer>
  );
};

export const openSiteDrawer = createNiceModal<
  { siteId: number; isCreate?: false } | { siteId?: undefined; isCreate: true },
  { siteId: number }
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
