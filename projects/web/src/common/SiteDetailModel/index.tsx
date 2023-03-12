import { Button, Drawer } from "@arco-design/web-react";
import { createNiceModal } from "../../utils/nicemodel";
import { useRequest } from "ahooks";

interface SiteInfo {
  id: number;
  siteKey: string;
}

export const openSiteDrawer = createNiceModal<
  { siteKey: string } | { isCreate: true },
  { siteInfo: SiteInfo }
>(({ _modal, ...props }) => {
  const { data: siteInfo } = useRequest(async () => {
    if ("siteKey" in props) {
      return {
        id: 1,
        siteKey: props.siteKey + "++++",
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
          siteInfo: { id: 99, siteKey: "3333", ...siteInfo },
        });
      }}
    ></Drawer>
  );
});
