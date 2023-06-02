import api from "api";
import { useEffect } from "react";

export default function () {
  useEffect(() => {
    const res = api.msg.msgInfo();
    return () => {
      void res.then((r) => {
        r.destory();
      });
    };
  }, []);
  return <div>概览</div>;
}
