import { Form, Grid, Input, Select, Switch } from "@arco-design/web-react";
import useWatch from "@arco-design/web-react/es/Form/hooks/useWatch";
import { useFormItem } from "@src/components/AForm/useFormItem";
import { useFormUtils } from "@src/components/AForm/useFormUtils";
import { ControlledInheritor } from "@src/components/ControlledInheritor";
import { useRequest } from "ahooks";
import api from "api";
import { initFormBuild } from "./interface";

import { useSiteDrawerStore } from "./useSiteDrawerStore";

export const PanelBuild: React.FC = () => {
  const { formBuild: form, formBasic } = useSiteDrawerStore();

  const fu = useFormUtils(form);
  const fuBasic = useFormUtils(formBasic);
  const FI = useFormItem(form);

  const repoDirPrefix: string = useWatch("rootDir", formBasic as any);

  const reqGitBranchInfo = useRequest(
    async () => {
      const gitAddress = fu.getValue("gitAddress");
      return await api.git.fetchGitBranchInfo(gitAddress);
    },
    { manual: true }
  );

  const handleGitAddressBlur = async () => {
    const hasError = Boolean(form.getFieldError("gitAddress"));
    const gitAddress = fu.getValue("gitAddress");
    // 校验出错，或者删除 gitAddress 地址，就清空接口拉到的信息
    if (hasError || !gitAddress) {
      reqGitBranchInfo.mutate();
      fu.setValue("gitBranch", "");
      return;
    }

    if (gitAddress !== reqGitBranchInfo.data?.gitAddress) {
      // 先把 gitAddress 设置进入，避免重复触发相同 gitAddress 的请求
      reqGitBranchInfo.mutate({
        gitAddress,
        branchs: [],
        headCommitId: "",
        headBranchName: "",
      });
      // 设置默认 branch
      const branchInfo = await reqGitBranchInfo.runAsync();
      fu.setValue("gitBranch", branchInfo.headBranchName);
    }
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 18 }}
      initialValues={initFormBuild()}
    >
      <FI
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
      </FI>

      <FI label="分支" field="gitBranch" rules={[{ required: true }]}>
        <ControlledInheritor>
          {(props) => (
            <div>
              <Select
                {...props}
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
              <FI
                label="自动Pull"
                field="gitAutoPull"
                rules={[{ required: true }]}
              >
                <Switch />
              </FI>
            </div>
          )}
        </ControlledInheritor>
      </FI>

      <FI
        field="repoDir"
        label="项目目录"
        rules={[{ required: true, message: "请填写根目录路径" }]}
        normalize={(d: string) => d?.replace(/\s+/g, "") || ""}
      >
        {(form) => (
          <Input
            placeholder="项目主目录路径"
            prefix={`/apps/${repoDirPrefix || "{站点根目录}"}${
              form.repoDir ? "/" : ""
            }`}
          />
        )}
      </FI>
    </Form>
  );
};
