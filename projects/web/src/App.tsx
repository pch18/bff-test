import { Router, RouterProvider, createBrowserRouter } from "react-router-dom";
import { RouterLayout } from "./components/RouterLayout";
import SiteList from "./pages/SiteList";
import Home from "./pages/Home";
import SiteDetail from "./pages/SiteDetail";
import NiceModal from "@ebay/nice-modal-react";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RouterLayout
        menuItems={[
          { path: "/", name: "概览" },
          { path: "/site", name: "站点" },
        ]}
      />
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/site",
        element: <SiteList />,
      },
      {
        path: "/site/:siteId",
        element: <SiteDetail />,
      },
    ],
  },
]);

function App() {
  return (
    <NiceModal.Provider>
      <RouterProvider router={router} />
    </NiceModal.Provider>
  );
}

export default App;
