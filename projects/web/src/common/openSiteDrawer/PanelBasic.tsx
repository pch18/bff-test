import { Form, Input } from "@arco-design/web-react";
import { useRef } from "react";
import { isEqual } from "lodash-es";
import { useSiteDrawerStore } from "./utils/useSiteDrawerStore";
import { useFormItem } from "@/components/AForm";

const validateDomain = (domain?: string) =>
  Boolean(
    domain?.match(
      /^(https?:\/\/)?([a-z0-9\u4e00-\u9fa5]+\.)+[a-z0-9\u4e00-\u9fa5]+$/
    )
  );

export const PanelBasic: React.FC = () => {
  const { fu, formIns, isCreate } = useSiteDrawerStore();

  const FI = useFormItem(formIns, {
    labelCol: { span: 6 },
    wrapperCol: { span: 17 },
  });

  /** 记录根目录是否人工修改过，就不自动填充了 */
  const rootDirChangedRef = useRef(!isCreate);

  // domains 字段的校验
  const handleDomainsValidator = (
    domainList: string[] | undefined,
    callback: (err: string) => void
  ) => {
    const faildDomainList = domainList?.filter((d) => !validateDomain(d)) || [];
    if (faildDomainList.length > 0) {
      callback(
        `域名: ${faildDomainList.map((d) => `[${d}]`).join(" ")} 格式不正确`
      );
    }
    // 更新，如果 rootDir 为空，则自动写入根目录地址
    if (!fu.getValue("homeDir").trim()) {
      rootDirChangedRef.current = false;
    }
    // 如果第一行校验是通过的，则自动将第一行域名作为根目录地址
    if (
      !rootDirChangedRef.current &&
      domainList?.[0] &&
      validateDomain(domainList[0])
    ) {
      fu.setValue("homeDir", domainList[0]);
    }
  };

  // 在 domains 输入框 blur 时，清除所有空白字符
  const handleDomainsBlur = () => {
    const originDomains = fu.getValue("domains");
    const trimDomains = originDomains
      .map((line) => line.replace(/\s+/g, ""))
      .filter(Boolean);
    if (!isEqual(originDomains, trimDomains)) {
      fu.setValue("domains", trimDomains);
      // setvalue之后，不validate的话，会清除报错信息
      void formIns.validate(["domains"]);
    }
  };

  // 在 rootDir 输入框 blur 时，输入框内若未填写，则自动填充 domains 第一条信息
  const handleRootDirBlur = () => {
    const originRootDir = fu.getValue("homeDir");
    const trimRootDir = originRootDir.replace(/\s+/g, "");
    if (trimRootDir) {
      if (trimRootDir !== originRootDir) {
        fu.setValue("homeDir", trimRootDir);
      }
    } else {
      const [domain] = fu.getValue("domains");
      if (validateDomain(domain)) {
        fu.setValue("homeDir", domain);
      }
    }
  };

  return (
    <>
      <FI
        field="domains"
        label="域名"
        rules={[
          { required: true, message: "请填写域名" },
          { validator: handleDomainsValidator },
        ]}
        output={(widgetValue: string) => widgetValue.split("\n")}
        input={(fieldValue) => fieldValue.join("\n")}
      >
        <Input.TextArea
          placeholder={
            "格式: xxxx.com | 支持多行 | 一行一条 \n默认http强跳https | 可指定: 端口 / 协议 / 泛域名 \n例: xxxx.com:88 | http://xxxx.com | *.xxxx.com"
          }
          autoSize={true}
          onBlur={handleDomainsBlur}
        />
      </FI>

      <FI
        field="homeDir"
        label="主目录"
        rules={[{ required: true, message: "请填写主目录路径" }]}
        output={(d: string) =>
          d
            .replace(/\/+/g, "/")
            .replace(/^\//, "")
            .replace(/[\s\\.]+/g, "")
        }
      >
        <Input
          placeholder="项目主目录路径"
          onChange={(t) => (rootDirChangedRef.current = Boolean(t))}
          prefix="/apps/"
          onBlur={handleRootDirBlur}
        />
      </FI>

      <FI field="note" label="备注">
        <Input.TextArea
          placeholder={"自定义备注描述\n支持输入多行"}
          autoSize={true}
        />
      </FI>
    </>
  );
};
