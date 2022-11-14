
const delay = (t: number) => new Promise(r => setTimeout(r, t))

export interface UserInfo {
  name: string,
  mobile: string
}

export const getUserInfo = async () => {
  await delay(1000)
  const user: UserInfo = {
    name: Math.random().toString(),
    mobile: Math.random().toString()
  }
  return user
}