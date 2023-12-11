import { useEffect, useState } from "react";
import {
  createTRPCProxyClient,
  createWSClient,
  splitLink,
  httpBatchLink,
  // loggerLink,
  wsLink,
} from "@trpc/client";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { AppRouter } from "../../server/api";
import "./App.css";

const client = createTRPCProxyClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === "subscription",
      true: wsLink({
        client: createWSClient({ url: "ws://localhost:3000/trpc" }),
      }),
      false: httpBatchLink({ url: "http://localhost:3000/trpc" }),
    }),

    // loggerLink(),
  ],
});

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    (async () => {
      const result = await client.users.get.query({ userId: "5" });

      console.log(result);
      // client.users.onUpdate.subscribe(undefined, {
      //   onData: (id) => {
      //     console.log("cambio el usuario con id: ", id);
      //   },
      // });
    })();
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() =>
            // client.users.update.mutate({ userId: "1", name: "30" })
            setCount((c) => c + 1)
          }
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
