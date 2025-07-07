import { useRef } from "react";
import { RealtimeService } from "assemblyai";

export function useAssemblyAIStream({ onTranscript }) {
  const streamRef = useRef(null);

  //start streaming to AssemblyAI
  const start = async () => {
    //get a token from your backend
    const resp = await fetch("/token");
    const { token } = await resp.json();

    //create a new real-time streaming instance
    const stream = new RealtimeService({ token });
    streamRef.current = stream;

    //handle connection instance
    stream.on("open", ({ sessionId }) => {
      console.log("Assembly AI session opened", sessionId);
    });
    stream.on("close", (code, reason) => {
      console.log("AssemblyAI session closed:", code, reason);
    });
    stream.on("error", (err) => {
      console.error("AssemblyAI error:", err);
    });

    //handle transcript events
    stream.on("transcript", (msg) => {
      if (msg.text && onTranscript) {
        onTranscript(msg);
      }
    });

    await stream.connect();
    return stream;
  };

  //send audio buffer to AssemblyAI
  const sendAudio = (buffer) => {
    if (streamRef.current) {
      streamRef.current.sendAudio(buffer);
    }
  };

  //stop streaming
  const stop = async () => {
    if (streamRef.current) {
      await streamRef.current.close();
      streamRef.current = null;
    }
  };

  return { start, stop, sendAudio };
}
