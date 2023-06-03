import { ApiError, createBffStream, getCtx } from "@bff-sdk/api";

const func2 = async () => {
  return await func1();
};

export async function func1() {
  const a = createBffStream(1 as any);
  const v = a;
  return await v;
}

export async function func3(a: number, b: string) {
  return new ApiError("123");
}

export const func4 = async (a: number, b: string) => {
  void createBffStream(4 as any);
};

export const msgInfo = async () =>
  await createBffStream<{
    msg: string;
    header: any;
  }>(async ({ send, loop, lastId = 12 }) => {
    const ctx = getCtx();
    let time = 0;

    await loop((stop) => {
      lastId++;
      time++;

      send("msg", lastId, `${time}_${lastId}`);
      send("header", null, ctx.header);
      if (time > 5) throw new Error();
    }, 1000);
  });

export { func2 as tettttt };
