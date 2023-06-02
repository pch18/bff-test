import { ApiError, getCtx } from "@bff-sdk/api";

export const getAllUsers = async () => {
  // const ctx = getCtx()
  return [];
};

// const useCheckAdmin = () => {
//   const ctx = getCtx()
//   if (!ctx.admin) {
//     throw new ApiError('xxx',403,403)
//   }
// }

export const addUser2 = async (name: string) => {
  const ctx = getCtx();
  // useCheckAdmin()

  return [];
};
