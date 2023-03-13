export interface SiteInfo {
  id: number;
  /** 站点域名,多个用逗号分割 */
  domain: string;
  /** 项目的主目录 */
  homeDir: string;
  rewrites: SiteRewriteConfig[];
  /** 对应的服务 */
  services: SiteService[];
  errorPage: SiteErrorPage;
}

interface SiteRewriteConfig {
  matcher: string;
  to: string;
}

interface SiteErrorPageConfig {
  file?: string;
  msg?: string;
}

interface SiteErrorPage {
  404: SiteErrorPageConfig;
  500: SiteErrorPageConfig;
}

enum SiteServiceType {
  Static = "Static",
  Spa = "Spa",
  Fixed = "Fixed",
  Php = "Php",
  Proxy = "Proxy",
}

enum SiteServiceMatchType {
  /** 完全匹配 */
  Perfect = "Perfect",
  /** 通配符匹配 */
  Wildcard = "wildcard",
  /** 正则匹配 */
  Regular = "Regular",
}

interface BaseSiteService {
  /** 地址匹配 */
  path: string;
  /** 匹配模式 */
  matchType: SiteServiceMatchType;
  /** 服务类型 */
  serviceType: SiteServiceType;
}

/** 静态文件站点 */
interface StaticSiteService extends BaseSiteService {
  type: SiteServiceType.Static;
  /** 入口目录, 默认为站点主目录 */
  homeDir: string;
  /** 目录是否可浏览结构 */
  browser: boolean;
}

/** spa应用,比如react */
interface SpaSiteService extends BaseSiteService {
  type: SiteServiceType.Spa;
  /** 入口目录, 默认为站点主目录 */
  homeDir: string;
  /** not found 时返回的文件(spa入口文件) */
  entryPath: string;
}

/** 固定的返回 */
interface FixedSiteService extends BaseSiteService {
  type: SiteServiceType.Spa;
  /** 入口目录, 默认为站点主目录 */
  homeDir: string;
  /** not found 时返回的文件(spa入口文件) */
  entryPath: string;
}

/** php服务的地址 */
interface PhpSiteService extends BaseSiteService {
  type: SiteServiceType.Php;
  /** 版本选择 */
  version: 5 | 7;
  /** 单入口时, rewrite的文件 */
  entryPath: string;
}

/** 反向代理的Service */
interface ProxySiteService extends BaseSiteService {
  type: SiteServiceType.Php;
  /** 反向代理访问的地址,例:http://10.0.0.1:3000 */
  proxyAddress: string;
}

type SiteService =
  | StaticSiteService
  | SpaSiteService
  | PhpSiteService
  | ProxySiteService;
