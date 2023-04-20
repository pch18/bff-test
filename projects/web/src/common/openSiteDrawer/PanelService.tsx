import { Form, Grid, Input, Select, Switch } from "@arco-design/web-react";
import useWatch from "@arco-design/web-react/es/Form/hooks/useWatch";
import { useFormItem, useFormUtils } from "@/components/AForm";
import { ControlledInheritor } from "@/components/ControlledInheritor";
import { useRequest } from "ahooks";
import api from "api";
import { initFormBuild, initSiteServiceConfig } from "./utils/initDatas";

import { useSiteDrawerStore } from "./utils/useSiteDrawerStore";
import { AFormListCollapse } from "@/components/AForm/AFormListCollapse";
import { AFormWatch } from "@/components/AForm/AFormWatch";
import { type FC } from "react";

export const PanelService = () => {
  const { fu, formIns } = useSiteDrawerStore();

  return (
    <AFormListCollapse
      form={formIns}
      field="serviceConfig"
      itemsKeyName="id"
      onAdd={() => initSiteServiceConfig()}
      addBtnText="添加服务"
      renderTitle={(field) => (
        <AFormWatch form={formIns} field={`${field}.name` as const}>
          {(path) => (path ? `名称：${path}` : "未设置名称")}
        </AFormWatch>
      )}
    >
      {(field, index) => <ServiceItem field={field} index={index} />}
    </AFormListCollapse>
  );
};

export const ServiceItem: FC<{
  field: `serviceConfig[${number}]`;
  index: number;
}> = ({ field }) => {
  const { fu, formIns } = useSiteDrawerStore();

  const FI = useFormItem(formIns, {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  });

  const reqGitBranchInfo = useRequest(
    async () => {
      const repoUrl = fu.getValue(`${field}.repoUrl`);
      return await api.git.fetchGitBranchInfo(repoUrl);
    },
    { manual: true }
  );

  const handleGitAddressBlur = async () => {
    const hasError = Boolean(fu.getFieldError(`${field}.repoUrl`));
    const repoUrl = fu.getValue(`${field}.repoUrl`);
    // 校验出错，或者清空 repoUrl 地址，就清空接口拉到的信息
    if (hasError || !repoUrl) {
      reqGitBranchInfo.mutate();
      fu.setValue(`${field}.repoBranch`, "");
      return;
    }

    if (repoUrl !== reqGitBranchInfo.data?.repoUrl) {
      // 先把 gitAddress 设置进入，避免重复触发相同 gitAddress 的请求
      reqGitBranchInfo.mutate({
        repoUrl,
        branchs: [],
        headCommitId: "",
        headBranchName: "",
      });
      // 设置默认 branch
      const branchInfo = await reqGitBranchInfo.runAsync();
      fu.setValue(`${field}.repoBranch`, branchInfo.headBranchName);
    }
  };

  return (
    <>
      <FI
        label="服务名称"
        field={`${field}.name` as const}
        rules={[{ required: true }]}
      >
        <Input placeholder="请输入服务名称" />
      </FI>

      <FI
        label="仓库地址"
        field={`${field}.repoUrl` as const}
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
        output={(d: string) => d.replace(/\s+/g, "")}
      >
        <Input
          placeholder="通过此地址自动 clone / pull 代码"
          onBlur={handleGitAddressBlur}
        />
      </FI>

      {/* <Grid.Row>
        <Grid.Col span={13}>
          <FI
            field={`${field}.repoUser` as const}
            label="登录鉴权"
            rules={[{ required: true }]}
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 14 }}
          >
            <Input placeholder="git用户名" />
          </FI>
        </Grid.Col>
        <Grid.Col span={11}>
          <FI field={`${field}.repoPsw` as const} noStyle>
            <Input placeholder="git密码" />
          </FI>
        </Grid.Col>
      </Grid.Row> */}

      <Grid.Row>
        <Grid.Col span={17}>
          <FI
            label="分支"
            field={`${field}.repoBranch` as const}
            rules={[{ required: true }]}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
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
        <Grid.Col span={6}>
          <FI
            field={`${field}.autoPullBuild` as const}
            label="自动部署"
            labelCol={{ span: 20 }}
            wrapperCol={{ span: 4 }}
            rules={[{ required: true }]}
          >
            <Switch />
          </FI>
        </Grid.Col>
      </Grid.Row>

      <Grid.Row>
        <Grid.Col span={17}>
          <FI
            label="构建镜像"
            field={`${field}.imageName` as const}
            rules={[{ required: true }]}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
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
            field={`${field}.imageTag` as const}
            noStyle
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
      <FI
        field={`${field}.buildCmd` as const}
        label="构建命令"
        rules={[{ required: true }]}
      >
        <Input placeholder="仅支持单行命令" />
      </FI>
      <FI
        field={`${field}.startCmd` as const}
        label="启动命令"
        rules={[{ required: true }]}
      >
        <Input placeholder="仅支持单行命令" />
      </FI>
      <FI
        field={`${field}.entryPort` as const}
        label="服务端口"
        rules={[{ required: true }]}
      >
        <Input placeholder="仅支持单行命令" />
      </FI>
    </>
  );
};
