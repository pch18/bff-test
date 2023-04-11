import { type NiceModalInjection } from "@/utils/nicemodel";

import { createStore } from "hox";
import { useFormInstance } from "@/components/AForm/useFormInstance";
import { initSiteConfig, type SiteConfig } from "./initDatas";
import { useFormItem, useFormUtils } from "@/components/AForm";

export const [useSiteDrawerStore, SiteDrawerStoreProvider] = createStore(
  (initData: {
    isCreate: boolean;
    siteId?: number;
    _modal: NiceModalInjection<{ siteId: number }>;
  }) => {
    const formIns = useFormInstance<SiteConfig>(initSiteConfig);
    const fu = useFormUtils(formIns);

    return {
      ...initData,
      formIns,
      fu,
    };
  }
);
