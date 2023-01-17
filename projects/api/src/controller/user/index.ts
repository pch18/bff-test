import { useCtx } from "@bff-sdk/api"
import { prisma } from "../../utils/prisma"



export const getAllUsers = async () => {
  // const ctx = useCtx()
  const users = await prisma.user.findMany()
  return users
}



export const addUser = async (name: string) => {
  const ctx = useCtx()
  console.log({ name })

  const user = await prisma.user.create({
    data: {
      name: name,
      email: name,
    }
  })

  return { user, ctx }
}
