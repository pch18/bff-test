import { Button, Drawer } from "@arco-design/web-react";
import { openSiteDrawer } from "../../common/SiteDetailModel";

export default function () {
  return (
    <div className="p-4">
      <Button
        onClick={async () => {
          console.log(await openSiteDrawer({ siteKey: "123" }));
        }}
      >
        新建站点
      </Button>
    </div>
  );
}
