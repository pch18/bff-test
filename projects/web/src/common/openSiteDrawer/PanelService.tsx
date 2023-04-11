import { Form, Grid, Input, Select, Switch } from "@arco-design/web-react";
import useWatch from "@arco-design/web-react/es/Form/hooks/useWatch";
import { useFormItem, useFormUtils } from "@/components/AForm";
import { ControlledInheritor } from "@/components/ControlledInheritor";
import { useRequest } from "ahooks";
import api from "api";
import { initFormBuild } from "./utils/initDatas";

import { useSiteDrawerStore } from "./useSiteDrawerStore";

export const PanelService: React.FC = () => {
  const { fu, form } = useSiteDrawerStore();

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
    <>
      <FI
        label="仓库地址"
        field="gitAddress"
        rules={[
          { required: true },
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

      <Grid.Row>
        <Grid.Col span={16}>
          <FI
            label="分支"
            field="gitBranch"
            rules={[{ required: true }]}
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 15 }}
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
          </FI>
        </Grid.Col>
        <Grid.Col span={8}>
          <FI
            field="gitAutoPull"
            label="自动Pull"
            labelCol={{ span: 15 }}
            wrapperCol={{ span: 5 }}
            rules={[{ required: true }]}
          >
            <Switch />
          </FI>
        </Grid.Col>
      </Grid.Row>

      <Grid.Row>
        <Grid.Col span={16}>
          <FI
            field="repoDir"
            label="仓库目录"
            normalize={(d: string) =>
              d
                .replace(/[\s\\.]+/g, "")
                .replace(/^\//, "")
                .replace(/\/+/g, "/")
            }
            rules={[{ required: true }]}
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 15 }}
          >
            <Input prefix="./" placeholder="主目录下相对路径" />
          </FI>
        </Grid.Col>
        <Grid.Col span={8}>
          <FI
            field="gitAutoPull"
            label="用主目录"
            labelCol={{ span: 15 }}
            wrapperCol={{ span: 5 }}
          >
            <Switch />
          </FI>
        </Grid.Col>
      </Grid.Row>

      <Grid.Row>
        <Grid.Col span={16}>
          <FI
            label="构建镜像"
            field="buildImageName"
            rules={[{ required: true }]}
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 15 }}
            normalize={(v: string | undefined) => v || ""}
            formatter={(v) => v || undefined}
          >
            <Select
              placeholder="镜像名称"
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
          </FI>
        </Grid.Col>
        <Grid.Col span={7}>
          <FI
            rules={[{ required: true }]}
            field="buildImageVersion"
            wrapperCol={{ span: 24 }}
            normalize={(v: string | undefined) => v || ""}
            formatter={(v) => v || undefined}
          >
            <Select
              placeholder="版本"
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
          </FI>
        </Grid.Col>
      </Grid.Row>
      <FI field="repoDir" label="构建命令" rules={[{ required: true }]}>
        <Input placeholder="仅支持单行命令" />
      </FI>
    </>
  );
};
