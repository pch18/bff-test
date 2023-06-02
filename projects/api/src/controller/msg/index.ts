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
    a: 1
  }>(async ({ send, loop }) => {
    let time = 1;
    await loop((stop) => {
      send("msg", time, `123_${time++}`);
      if (time > 10) stop();
    }, 1000);
  });

export { func2 as tettttt };
