import {
  Button,
  Drawer,
  Table,
  TableColumnProps,
} from "@arco-design/web-react";
import { openSiteDrawer } from "../../common/SiteDetailModel";
import { useAntdTable, useRequest } from "ahooks";

const columns: TableColumnProps[] = [
  {
    title: "#",
    dataIndex: "id",
  },
  {
    title: "域名",
    dataIndex: "domain",
  },
  {
    title: "状态",
    dataIndex: "status",
  },
  {
    title: "主目录",
    dataIndex: "root",
  },
  {
    title: "证书日期",
    dataIndex: "sslExp",
  },
  {
    title: "备注",
    dataIndex: "extraInfo",
  },
];
export default function () {
  const { tableProps } = useAntdTable(async () => {
    return {
      total: 11,
      list: [{ name: 1 }],
    };
  });
  return (
    <div className="p-4">
      <div className="mb-3">
        <Button
          onClick={async () => {
            console.log(await openSiteDrawer({ siteKey: "123" }));
          }}
        >
          新建站点
        </Button>
      </div>

      <Table columns={columns} {...tableProps} />
    </div>
  );
}
