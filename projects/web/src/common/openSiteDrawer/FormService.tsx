import {
  Collapse,
  Form,
  type FormInstance,
  Grid,
  Input,
  Select,
  Switch,
} from "@arco-design/web-react";
import { useRef } from "react";
import { useRequest } from "ahooks";
import api from "api";

export const FormService: React.FC = ({}) => {
  return (
    <>
      <Collapse accordion>
        <Form.List field="posts">
          {(fields, { add, remove, move }) =>
            fields.map((item, index) => (
              <Collapse.Item
                key={item.key}
                name={item.field}
                header={`${fields[item.key].field}`}
              >
                Beijing Toutiao Technology Co., Ltd.
              </Collapse.Item>
            ))
          }
        </Form.List>

        <Collapse.Item header="Beijing Toutiao Technology Co., Ltd." name="2">
          Beijing Toutiao Technology Co., Ltd.
        </Collapse.Item>
        <Collapse.Item header="Beijing Toutiao Technology Co., Ltd." name="3">
          Beijing Toutiao Technology Co., Ltd.
        </Collapse.Item>
      </Collapse>
    </>
  );
};
