import { useState } from 'react'
import './App.css'
import api from 'api'
import { UserInfo } from 'api/src/controller/user'

function App() {
  const [userInfoList, setUserInfoList] = useState<UserInfo[]>([])

  return (
    <div className="App">
      {userInfoList.map(u => <div>{JSON.stringify(u)}</div>)}

      <button onClick={async (u) => {
        const newUserInfo = await api.user.getUserInfo()
        setUserInfoList(u => [...u, newUserInfo])
      }}>fetch</button>
    </div>
  )
}

export default App
