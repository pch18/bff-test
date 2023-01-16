import { useCtx } from "@bff-sdk/api"

const delay = (t: number) => new Promise(r => setTimeout(r, t))

export interface UserInfo {
  name: string,
  mobile: string
}

export const getUserInfo = async () => {
  await delay(200)
  const ctx = useCtx()
  const user = {
    name: Math.random().toString(),
    mobile: Math.random().toString(),
    a: ctx.href
  }
  return user
} 