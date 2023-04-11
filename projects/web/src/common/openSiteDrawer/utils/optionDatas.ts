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
