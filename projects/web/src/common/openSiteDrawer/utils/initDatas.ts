import {
  type SiteConfig,
  type SiteRouteConfig,
  type SiteServiceConfig,
  type SiteCertConfig,
  type SiteRewriteConfig,
} from "api/src/controller/site/interface/SiteConfig";
import * as uuid from "uuid";

export {
  type SiteConfig,
  type SiteRouteConfig,
  type SiteServiceConfig,
  type SiteCertConfig,
  type SiteRewriteConfig,
} from "api/src/controller/site/interface/SiteConfig";

export const initSiteConfig = (): SiteConfig => {
  return {
    id: uuid.v4(),
    domains: [],
    homeDir: "",
    note: "",
    routeConfig: [],
    serviceConfig: [],
    certConfig: [],
    rewriteConfig: [],
  };
};

export const initSiteRouteConfig = (
  type: SiteRouteConfig["type"]
): SiteRouteConfig => {
  const base = {
    id: uuid.v4(),
    path: "",
    matchType: "Wildcard",
  } as const;
  switch (type) {
    case "Static":
      return { ...base, type: "Static", entryDir: "", canBrowse: false };
    case "Php":
      return { ...base, type: "Php", entryDir: "" };
    case "Spa":
      return { ...base, type: "Spa", entryDir: "", entryFile: "" };
    case "ReverseProxy":
      return { ...base, type: "ReverseProxy", reverseProxyUrl: "" };
    case "BindService":
      return { ...base, type: "BindService", bindServiceId: "" };
  }
};

export const initSiteServiceConfig = (): SiteServiceConfig => {
  return {
    id: uuid.v4(),
    repoPath: "",
    repoUser: undefined,
    repoPsw: undefined,
    imageName: "pch18/node19_pnpm6",
    imageTag: "latest",
    containerName: "",
    buildCmd: "pnpm i && pnpm build",
    startCmd: "pnpm start",
    entryPort: 3000,
    env: [],
  };
};
