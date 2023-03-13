import { Button, Form, Grid, Input } from "@arco-design/web-react";
import { IconMinus, IconPlus } from "@arco-design/web-react/icon";
import { ControlledInheritor } from "../../components/ControlledInheritor";
import { useState } from "react";

export const BaseForm: React.FC = () => {
  const [needGitAddressAuth, setNeedGitAddressAuth] = useState(false);
  return (
    <>
      <Form.Item label="域名" field="domain" rules={[{ required: true }]}>
        <Input.TextArea
          placeholder={
            "xx.com 一行一条 可指定: 端口 / 协议 / 泛域名\n例: xx.com:88, http://xx.com, *.xx.com"
          }
          autoSize={true}
        />
      </Form.Item>

      <Form.Item label="根目录" field="homeDir" rules={[{ required: true }]}>
        <Input placeholder="项目的根目录路径" />
      </Form.Item>

      <Form.Item label="仓库地址" field="gitAddress">
        <Input placeholder="通过此地址自动 clone / pull 代码" />
      </Form.Item>

      {!needGitAddressAuth ? null : (
        <>
          <Form.Item
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 15 }}
            label="鉴权用户"
            field="gitAddressAuth.user"
            rules={[{ required: true }]}
          >
            <Input placeholder="git仓库访问用户" />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 15 }}
            label="鉴权密码"
            field="gitAddressAuth.pass"
            rules={[{ required: true }]}
          >
            <Input placeholder="git仓库访问密码" />
          </Form.Item>
        </>
      )}
      
      <Form.Item label="备注" field="note">
        <Input.TextArea
          placeholder={`自定义备注描述 (可换行)`}
          autoSize={true}
        />
      </Form.Item>
    </>
  );
};
