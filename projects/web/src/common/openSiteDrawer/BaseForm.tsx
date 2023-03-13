import { Button, Form, FormInstance, Grid, Input, Select } from "@arco-design/web-react";
import { IconMinus, IconPlus } from "@arco-design/web-react/icon";
import { ControlledInheritor } from "../../components/ControlledInheritor";
import { useState } from "react";
import { useRequest } from "ahooks";
import api from 'api'
import { SelectObjectMultiple } from "../../components/SelectObjectMultiple";
import { SelectObject } from "../../components/SelectObject";

export const BaseForm: React.FC<{ form: FormInstance }> = ({ form }) => {

  const reqGitBranchInfo = useRequest(
    async () => {
      const gitAddress = form.getFieldValue('gitAddress')
      return await api.git.fetchGitBranchInfo(gitAddress)
    }, { manual: true }
  )

  const handleGitAddressBlur = () => {
    const hasError = form.getFieldError('gitAddress')
    if (!hasError) {
      const gitAddress = form.getFieldValue('gitAddress')
      if (gitAddress) {
        if (gitAddress !== reqGitBranchInfo.data?.gitAddress) {
          return reqGitBranchInfo.runAsync().then(r => form.setFieldValue('gitBranch', r.headBranchName))
        } else {
          return
        }
      }
    }
    reqGitBranchInfo.mutate()
  }

  return (
    <>
      <Form.Item label="域名" field="domain" rules={[{ required: true, message: '请填写域名' }]}>
        <Input.TextArea
          placeholder={
            "xx.com 一行一条 可指定: 端口 / 协议 / 泛域名\n例: xx.com:88, http://xx.com, *.xx.com"
          }
          autoSize={true}
        />
      </Form.Item>

      <Form.Item label="根目录" field="homeDir" rules={[{ required: true, message: '请填写根目录路径' }]}>
        <Input placeholder="项目主目录路径" />
      </Form.Item>

      <Form.Item label="仓库地址" field="gitAddress" rules={[{
        validator(value, callback) {
          if (!value || value?.match?.(/^https?:\/\/.*\.git/)) {
            callback()
          } else {
            callback('请输入正确git仓库地址 例: https://github.com/xxx/yyy.git')
          }
        },
      }]}
        formatter={d => d?.replace(/s+/g, '')}
      >
        <Input placeholder="通过此地址自动 clone / pull 代码" onBlur={handleGitAddressBlur} />
      </Form.Item>


      <Form.Item noStyle shouldUpdate>
        {(formData, form) => !formData.gitAddress ? null :
          <Form.Item
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 15 }}
            label="分支"
            field="gitBranch"
            rules={[{ required: true }]}
          >
            <Select
              loading={reqGitBranchInfo.loading}
              options={reqGitBranchInfo.data?.branchs.map(b => b.branchName) || []} />
          </Form.Item>
        }
      </Form.Item>


      <Form.Item label="备注" field="note">
        <Input.TextArea
          placeholder={`自定义备注描述 (可换行)`}
          autoSize={true}
        />
      </Form.Item>
    </>
  );
};
