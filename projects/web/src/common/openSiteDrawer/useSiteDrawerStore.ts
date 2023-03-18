import { type NiceModalInjection } from "../../utils/nicemodel";
import {
  type IFormBuild,
  type IFormBasic,
  type IFormService,
} from "./interface";
import { createStore } from "hox";
import useForm from "@arco-design/web-react/es/Form/useForm";

export const [useSiteDrawerStore, SiteDrawerStoreProvider] = createStore(
  (initData: {
    isCreate: boolean;
    siteId?: number;
    _modal: NiceModalInjection;
  }) => {
    const [formBasic] = useForm<IFormBasic>();
    const [formBuild] = useForm<IFormBuild>();
    const [formService] = useForm<IFormService>();

    return {
      ...initData,

      formBasic,
      formBuild,
      formService,
    };
  }
);
