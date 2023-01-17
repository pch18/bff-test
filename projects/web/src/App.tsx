import { useState } from "react";
import "./App.css";
import api from "api";
import { UserInfo } from "api/src/controller/user";

function App() {
  // const [userInfoList, setUserInfoList] = useState<UserInfo[]>([])
  const [users, setUsers] = useState("");
  const [name, setName] = useState("");
  return (
    <div className="App">
      {users}
      <button
        onClick={async (u) => {
          const resp = await api.user.getAllUsers();
          setUsers(JSON.stringify(resp));
        }}
      >
        fetch
      </button>

      <input onChange={(e) => setName(e.target.value)} value={name}></input>
      <button
        onClick={async (u) => {
          await api.user.addUser(name);
        }}
      >
        add
      </button>
    </div>
  );
}

export default App;
