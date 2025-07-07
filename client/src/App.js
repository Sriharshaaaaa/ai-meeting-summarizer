import { useState } from "react";
import AudioStreamer from "./features/audio/AudioStreamer";

function App() {
  const [transcript, setTranscript] = useState("");

  // Handler for AssemblyAI transcript events
  const handleTranscript = (msg) => {
    // You can enhance this to handle partial/final logic as needed
    setTranscript((prev) => prev + " " + msg.text);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <AudioStreamer onTranscript={handleTranscript} />
      <div className="mt-8 w-full max-w-2xl p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-bold mb-2">Live Transcript:</h2>
        <div className="whitespace-pre-wrap">{transcript}</div>
      </div>
    </div>
  );
}

export default App;
