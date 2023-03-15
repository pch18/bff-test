export interface SiteFormBasic {
  /** 域名列表 */
  domains: string[];
  /** 根目录 */
  rootDir: string;
  /** git地址 */
  gitAddress: string;
  /** git分支 */
  gitBranch: string;
  /** git自动拉取 */
  gitAutoPull: boolean;
  /** 备注 */
  note: string;
}

export const initSiteFormBasic = (): SiteFormBasic => {
  return {
    domains: [],
    rootDir: "",
    gitAddress: "",
    gitBranch: "",
    gitAutoPull: false,
    note: "",
  };
};
