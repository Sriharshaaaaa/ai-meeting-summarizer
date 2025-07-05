import { useMicrophone } from "./useMicrophone";
import { socket } from "../../socket";
import { useState } from "react";

export default function AudioStreamer() {
  const [recording, setRecording] = useState(false);

  //handle each audio chunk
  const handleAudioChunk = (blob) => {
    blob.arrayBuffer().then((buffer) => {
      //emit buffer to backend
      socket.emit("audio-chunk", buffer);
    });
  };

  const { start, stop, isRecording} = useMicrophone(handleAudioChunk);

  return (
    <div className="flex flex-col items-center gap-4">
        <button
            className={`px-6 py-2 rounded bg-blue-600 text-white ${isRecording ?
                "opacity-60": " " }`}
            onClick={()=>{
                if(!isRecording){
                    start();
                    setRecording(true);
                }else {
                    stop();
                    setRecording(false);
                }
            }}
        >
            {isRecording? "Stop Recording": "Start Recording"}
        </button>
    </div>
  );
}
