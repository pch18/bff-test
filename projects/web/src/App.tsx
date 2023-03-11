import {
  Suspense,
  createContext,
  lazy,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "./App.css";
import api from "api";

function App() {
  const [users, setUsers] = useState("");
  const [name, setName] = useState("".concat("123" + 1));

  // useEffect(() => {
  //   console.log("xxxxxxx");
  //   setName("12312312312312321");
  // }, []);
  // if (1 + 1) {
  //   useRef();
  // }

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
          await api.user.addUser2(name);
        }}
      >
        add
      </button>
      <AsyncSuspenseProvider>
        <TestDataLoad />
      </AsyncSuspenseProvider>
    </div>
  );
}

const createAwaitComponent = <Props, Data>(
  promiseFn: (props: Props) => Promise<Data>,
  Component: React.FC<Props & { awaitData: Data }>
) => {
  return () => {
    const contextRef = useRef({
      ...AsyncSuspenseContextData,
      id: Math.random().toString(),
    });
  };
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const TestFetch = createAwaitComponent(
  async (props: { id: number }) => {
    await delay(1000);
    return { data: "fetched", id: props.id + 1 };
  },
  (props) => {
    const a = useRef();
    return (
      <div>
        <div>origin id: {props.id}</div>
        <div>awaitData id: {props.awaitData.id}</div>
        <div>awaitData data: {props.awaitData.data}</div>
      </div>
    );
  }
);

enum SuspenseStatus {
  Uninit,
  Pending,
  Resolved,
  Rejected,
}

const AsyncSuspenseContextData = {
  status: SuspenseStatus.Uninit,
  data: undefined as any,
  promise: undefined as any,
  id: "",
};

const AsyncSuspenseContext = createContext<
  React.MutableRefObject<typeof AsyncSuspenseContextData>
>(null as any);

const AsyncSuspenseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const contextRef = useRef({
    ...AsyncSuspenseContextData,
  });

  return (
    <Suspense fallback={<div>loging</div>}>
      <AsyncSuspenseContext.Provider value={contextRef}>
        {children}
      </AsyncSuspenseContext.Provider>
    </Suspense>
  );
};

// const contextRef = {
//   current: { ...AsyncSuspenseContextData },
// };
const useAsyncSuspense = (fn: any) => {
  const contextRef = useContext(AsyncSuspenseContext);

  if (contextRef.current.status === SuspenseStatus.Uninit) {
    contextRef.current.status = SuspenseStatus.Pending;
    contextRef.current.promise = fn().then((x: any) => {
      contextRef.current.status = SuspenseStatus.Resolved;
      contextRef.current.data = x;
    });
    throw contextRef.current.promise;
  } else if (contextRef.current.status === SuspenseStatus.Pending) {
    throw contextRef.current.promise;
  } else if (contextRef.current.status === SuspenseStatus.Resolved) {
    return contextRef.current.data;
  }
};

const TestDataLoad = () => {
  const data2 = useAsyncSuspense(async () => {
    await delay(2000);
    console.log("reqqq!!!");
    return "fetched pch1123123213213";
  });

  return (
    <p
      onClick={() => {
        console.log(data2);
      }}
    >
      {data2}
    </p>
  );
};

// const Sus = lazy(async () => {
//   await delay(1000);
//   const rnd = Math.random()
//   return {
//     default: (props) => {
//       return <div>xxxx123123 === {props.id} +++ {rnd}</div>;
//     },
//   };
// });

export default App;
