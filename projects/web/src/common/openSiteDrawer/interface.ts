export interface IFormBasic {
  /** 域名列表 */
  domains: string[];
  /** 根目录 */
  rootDir: string;
  /** 备注 */
  note: string;
}

export const initFormBasic = (): IFormBasic => {
  return {
    domains: [],
    rootDir: "",
    note: "",
  };
};

export interface IFormBuild {
  /** 仓库目录，空表示根目录 */
  repoDir: string;
  /** git地址 */
  gitAddress: string;
  /** git分支 */
  gitBranch: string;
  /** git自动拉取 */
  gitAutoPull: boolean;
}

export const initFormBuild = (): IFormBuild => {
  return {
    repoDir: "",
    gitAddress: "",
    gitBranch: "",
    gitAutoPull: false,
  };
};

export interface IFormService {
  /** 仓库目录，空表示根目录 */
  repoDir: string;
  /** git地址 */
  gitAddress: string;
  /** git分支 */
  gitBranch: string;
  /** git自动拉取 */
  gitAutoPull: boolean;
}

export const initFormService = (): IFormService => {
  return {
    repoDir: "",
    gitAddress: "",
    gitBranch: "",
    gitAutoPull: false,
  };
};
