import { Form, Grid, Input, Select, Switch } from "@arco-design/web-react";
import { useEffect, useRef } from "react";
import { useRequest } from "ahooks";
import api from "api";
import useForm from "@arco-design/web-react/es/Form/useForm";
import { initSiteFormBasic, type SiteFormBasic } from "./interface";
import { useFormUtils } from "../../hooks/useFormData";
import { isEqual } from "lodash-es";

const validateDomain = (domain?: string) =>
  domain?.match(
    /^(https?:\/\/)?([a-z0-9\u4e00-\u9fa5]+\.)+[a-z0-9\u4e00-\u9fa5]+$/
  );

export const FormBasic: React.FC<{ isCreate: boolean }> = ({ isCreate }) => {
  const [form] = useForm<SiteFormBasic>();
  const fu = useFormUtils(form);
  const reqGitBranchInfo = useRequest(
    async () => {
      const gitAddress = fu.getValue((f) => f.gitAddress);
      return await api.git.fetchGitBranchInfo(gitAddress);
    },
    { manual: true }
  );

  const domains = fu.getValue((f) => f.domains);
  console.log({ domains });

  const handleGitAddressBlur = async () => {
    const hasError = form.getFieldError("gitAddress");
    const gitAddress = fu.getValue((f) => f.gitAddress);
    if (hasError != null || !gitAddress) {
      reqGitBranchInfo.mutate();
      form.setFieldValue("gitBranch", "");
      return;
    }

    if (gitAddress !== reqGitBranchInfo.data?.gitAddress) {
      reqGitBranchInfo.mutate({
        gitAddress,
        branchs: [],
        headCommitId: "",
        headBranchName: "",
      });
      await reqGitBranchInfo.runAsync().then((r) => {
        form.setFieldValue("gitBranch", r.headBranchName);
      });
    }
  };
  const rootDirChangedRef = useRef(!isCreate);
  return (
    <Form
      form={form}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 18 }}
      initialValues={initSiteFormBasic()}
    >
      <Form.Item
        label="域名"
        field="domains"
        rules={[
          {
            required: true,
            message: "请填写域名",
          },
          {
            validator(data: any, callback) {
              const domainList = data as string[];
              const faildDomainList = domainList.filter(
                (d) => validateDomain(d) == null
              );
              if (faildDomainList.length > 0) {
                callback(
                  `域名: ${faildDomainList
                    .map((d) => `[${d}]`)
                    .join(" ")} 格式不正确`
                );
              } else {
                callback();
              }
              if (
                !rootDirChangedRef.current &&
                validateDomain(domainList[0]) != null
              ) {
                form.setFieldValue("rootDir", domainList[0]);
              }
            },
          },
        ]}
        formatter={(text) => {
          return text.join("\n");
        }}
        normalize={(input) => {
          return input.split("\n");
        }}
      >
        <Input.TextArea
          placeholder={
            "格式: xxxx.com | 支持多行 | 一行一条 \n默认http强跳https | 可指定: 端口 / 协议 / 泛域名 \n例: xxxx.com:88 | http://xxxx.com | *.xxxx.com"
          }
          autoSize={true}
          onBlur={() => {
            const originDomains = fu.getValue((f) => f.domains);
            const trimDomains = originDomains
              .map((line) => line.replace(/\s+/g, ""))
              .filter(Boolean);
            if (!isEqual(originDomains, trimDomains)) {
              form.setFieldValue("domains", trimDomains);
              void form.validate(["domains"]);
            }
          }}
        />
      </Form.Item>

      <Form.Item
        label="根目录"
        field="rootDir"
        rules={[{ required: true, message: "请填写根目录路径" }]}
        formatter={(d) => d?.replace(/\s+/g, "")}
      >
        <Input
          placeholder="项目主目录路径"
          onChange={(t) => (rootDirChangedRef.current = Boolean(t))}
          prefix="/apps/"
          onBlur={() => {
            if (fu.getValue((f) => f.rootDir)) {
              return;
            }
            const [domain] = fu.getValue("domains");
            if (validateDomain(domain) != null) {
              form.setFieldValue("rootDir", domain);
            }
          }}
        />
      </Form.Item>

      <Form.Item
        label="仓库地址"
        field="gitAddress"
        rules={[
          {
            validator(value, callback) {
              if (!value || value?.match?.(/^https?:\/\/.*\.git$/)) {
                callback();
              } else {
                callback(
                  "请输入正确git仓库地址 例: https://github.com/xxx/yyy.git"
                );
              }
            },
          },
        ]}
        formatter={(d) => d?.replace(/\s+/g, "")}
      >
        <Input
          placeholder="通过此地址自动 clone / pull 代码"
          onBlur={handleGitAddressBlur}
        />
      </Form.Item>

      {!(reqGitBranchInfo.loading || reqGitBranchInfo.data != null) ? null : (
        <>
          <Grid.Row>
            <Grid.Col offset={4} span={12}>
              <Form.Item
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                label="分支"
                field="gitBranch"
                rules={[{ required: true }]}
              >
                <Select
                  showSearch={true}
                  loading={reqGitBranchInfo.loading}
                  disabled={reqGitBranchInfo.loading}
                  options={
                    reqGitBranchInfo.data?.branchs?.map((b) => ({
                      value: b.branchName,
                      label:
                        b.branchName === reqGitBranchInfo.data?.headBranchName
                          ? `${b.branchName} (默认)`
                          : b.branchName,
                    })) ?? []
                  }
                />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={5}>
              <Form.Item
                labelCol={{ span: 23 }}
                wrapperCol={{ span: 1 }}
                label="自动Pull"
                field="gitAutoPull"
                rules={[{ required: true }]}
              >
                <Switch />
              </Form.Item>
            </Grid.Col>
          </Grid.Row>
        </>
      )}

      <Form.Item label="备注" field="note">
        <Input.TextArea
          placeholder={"自定义备注描述\n支持输入多行"}
          autoSize={true}
        />
      </Form.Item>
    </Form>
  );
};
