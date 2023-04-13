import { type SiteRouteConfig } from "./initDatas";

type SelectOptions<T> = Array<{ value: T; label: string }>;

const optionsToMap = <T extends string | number>(
  input: SelectOptions<T>
): Record<T, string> => {
  return Object.fromEntries(input.map((i) => [i.value, i.label])) as any;
};

export const optionsOfRouteMatchType: SelectOptions<
  SiteRouteConfig["matchType"]
> = [
  { value: "Perfect", label: "完全匹配" },
  { value: "RegExp", label: "正则匹配" },
  { value: "Wildcard", label: "通配符" },
];

export const mapOfRouteMatchType = optionsToMap(optionsOfRouteMatchType);

export const optionsOfRouteType: SelectOptions<SiteRouteConfig["type"]> = [
  { value: "Static", label: "静态目录" },
  { value: "Php", label: "PHP" },
  { value: "Spa", label: "SPA" },
  { value: "ReverseProxy", label: "反向代理" },
  { value: "BindService", label: "绑定服务" },
];
export const mapOfRouteType = optionsToMap(optionsOfRouteType);
