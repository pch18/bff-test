/** 站点配置 */
export interface SiteConfig {
  id: string;
  /** 站点域名,多个用逗号分割 */
  domains: string[];
  /** 项目的主目录 */
  homeDir: string;
  /** 备注信息 */
  note: string;
  /** 路由配置 */
  routeConfig: SiteRouteConfig[];
  /** 服务配置 */
  serviceConfig: SiteServiceConfig[];
  /** 证书配置 */
  certConfig: SiteCertConfig[];
  /** 伪静态配置 */
  rewriteConfig: SiteRewriteConfig[];
}

/** 站点路由配置 */
export type SiteRouteConfig = {
  id: string;
  /** 地址匹配 */
  path: string;
  /** 匹配模式（Perfect完全匹配、Wildcard通配符匹配、RegExp正则匹配） */
  matchType: "Perfect" | "Wildcard" | "RegExp";
} & (
  | {
      /** 服务类型 */
      type: "Static";
      /** 访问目录 */
      entryDir: string;
      /** 允许浏览目录 */
      canBrowse: boolean;
    }
  | {
      /** 服务类型 */
      type: "Php";
      /** 访问目录 */
      entryDir: string;
    }
  | {
      /** 服务类型 */
      type: "Spa";
      /** 访问目录 */
      entryDir: string;
      /** Spa入口文件 */
      entryFile: string;
    }
  | {
      /** 服务类型 */
      type: "ReverseProxy";
      /** 反向代理地址 */
      reverseProxyUrl: string;
    }
  | {
      /** 服务类型 */
      type: "BindService";
      /** 绑定外部服务的Id */
      bindServiceId: string;
    }
);

/** 站点服务配置 */
export interface SiteServiceConfig {
  id: string;

  /** 仓库地址 */
  repoPath: string;
  /** 仓库登录用户名 */
  repoUser?: string;
  /** 仓库登录密码 */
  repoPsw?: string;

  /** 镜像名 */
  imageName: string;
  /** 镜像版本 */
  imageTag: string;
  /** 容器名称 */
  containerName: string;
  /** 构建命令 */
  buildCmd: string;
  /** 运行命令 */
  startCmd: string;

  /** 服务访问端口号 */
  entryPort: number;
  /** 环境变量 */
  env: Array<{ name: string; value: string }>;
}

/** 站点证书配置 */
export interface SiteCertConfig {
  domain: string;
  type: "DNS";
}

/** 站点伪静态配置 */
export interface SiteRewriteConfig {
  matcher: string;
  to: string;
}
