import { Button, Drawer, Form, Input, Tabs } from "@arco-design/web-react";
import { createNiceModal } from "../../utils/nicemodel";
import { useRequest } from "ahooks";
import { BaseForm } from "./BaseForm";
import useForm from "@arco-design/web-react/es/Form/useForm";

interface SiteInfo {
  id: number;
  siteKey: string;
}

export const openSiteDrawer = createNiceModal<
  | { siteKey: string; isCreate?: false }
  | { siteKey?: undefined; isCreate: true },
  { siteInfo: SiteInfo }
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

  const [form] = useForm();

  return (
    <Drawer
      {..._modal.props}
      onOk={() => {
        _modal.resolve({
          siteInfo: { id: 99, siteKey: "3333", ...siteInfo },
        });
      }}
      title={<span>站点信息</span>}
      className="min-w-[500px] !w-1/2"
    >
      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
        <Tabs defaultActiveTab="base">
          <Tabs.TabPane key="base" title="基本">
            <BaseForm form={form} isCreate={isCreate} />
          </Tabs.TabPane>

          <Tabs.TabPane key="cert" title="构建" disabled={isCreate}>
            构建配置
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
      </Form>
    </Drawer>
  );
});
