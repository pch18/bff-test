import { useBffStream } from "@bff-sdk/web";
import api from "api";

export default function () {
  useBffStream(api.msg.msgInfo, {
    a(dataType) {},
  });

  return <div>概览</div>;
}
