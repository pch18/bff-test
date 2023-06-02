import api from "api";
import { useEffect } from "react";

export default function () {
  useEffect(() => {
    const res = api.msg.msgInfo();
    console.log(res);
  }, []);
  return <div>概览</div>;
}
