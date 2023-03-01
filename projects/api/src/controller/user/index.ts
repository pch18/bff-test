import { ApiError, useCtx } from "@bff-sdk/api"
import { prisma } from "../../utils/prisma"



export const getAllUsers = async () => {
  // const ctx = useCtx()
  const users = await prisma.user.findMany()
  return users
}

// const useCheckAdmin = () => {
//   const ctx = useCtx()
//   if (!ctx.admin) {
//     throw new ApiError('xxx',403,403)
//   }
// }


export const addUser2 = async (name: string) => {
  const ctx = useCtx()
  // useCheckAdmin()
  console.log({ name })

  const user = await prisma.user.create({
    data: {
      name: name,
      email: name,
    }
  })

  return { user, ip:ctx.ip }
}
