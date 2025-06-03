import { socket } from "./socket";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to server :", socket.id);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div className="flex h-screen justify-center items-centre text-xl">
      Socket.IO is connected!
    </div>
  );
}

export default App;
