import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      setConnected(true);
      console.log("Connected to server with id:", socket.id);
    });

    socket.on("disconnect", () => {
      setConnected(false);
      console.log("Disconnected from server");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">💬 Chat Realtime App</h1>
      <p>Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}</p>
    </div>
  );
}

export default App;
