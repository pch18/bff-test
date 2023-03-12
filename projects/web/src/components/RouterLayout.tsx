import {
  Layout,
  Menu,
  Breadcrumb,
  Button,
  Message,
} from "@arco-design/web-react";
import {
  IconHome,
  IconCalendar,
  IconCaretRight,
  IconCaretLeft,
} from "@arco-design/web-react/icon";
import { Suspense, useMemo } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { maxBy } from "lodash-es";

export const RouterLayout: React.FC<{
  menuItems: {
    path: string;
    /** 跳转地址,不填则同path */
    link?: string;
    name: string;
    icon?: React.ReactElement;
  }[];
}> = ({ menuItems }) => {
  const location = useLocation();
  const openMenu = useMemo(() => {
    const matchedItems = menuItems.filter((item) => {
      return location.pathname.startsWith(item.path);
    });
    const bestItem = maxBy(matchedItems, (item) => item.path.length);
    return bestItem;
  }, [location]);

  return (
    <Layout className="layout-collapse-demo min-h-full">
      <Layout.Sider collapsible>
        <div className="logo h-16 bg-gray-500 mx-3 my-2" />
        <Menu selectedKeys={openMenu ? [openMenu.path] : []}>
          {menuItems.map((item) => (
            <Link to={item.link ?? item.path} key={item.path}>
              <Menu.Item key={item.path}>
                {item.icon ?? <IconCalendar />}
                {item.name}
              </Menu.Item>
            </Link>
          ))}
        </Menu>
      </Layout.Sider>
      <Layout>
        {/* <Layout.Header>Header</Layout.Header> */}
        <Layout>
          <Layout.Content>
            <Suspense>
              <Outlet />
            </Suspense>
          </Layout.Content>
          {/* <Layout.Footer>Footer</Layout.Footer> */}
        </Layout>
      </Layout>
    </Layout>
  );
};
