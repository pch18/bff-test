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

export { func2 as tettttt };
