import { useState, useRef } from "react";
import { useAssemblyAIStream } from "./useAssemblyAIStream";

export default function AudioStreamer({ onTranscript }) {
  const [isRecording, setIsRecording] = useState(false);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const streamRef = useRef(null);
  const { start, sendAudio, stop } = useAssemblyAIStream({ onTranscript });

  //start mic and streaming

  //handle each audio chunk
  const startRecording = async () => {
    //start assemblyai streaming
    await start();

    //get mic streaming
    streamRef.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    audioContextRef.current = new (window.AudioContext ||
      window.webkitAudioContext)({ sampleRate: 16000 });
    const source = audioContextRef.current.createMediaStreamSource(
      streamRef.current
    );

    // ScriptProcessorNode is deprecated, but still widely supported for now
    processorRef.current = audioContextRef.current.createScriptProcessor(
      4096,
      1,
      1
    );
    source.connect(processorRef.current);
    processorRef.current.connect(audioContextRef.current.destination);

    processorRef.current.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      // Convert Float32Array [-1,1] to Int16Array PCM
      const pcm = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) {
        pcm[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
      }
      sendAudio(pcm.buffer);
    };

    setIsRecording(true);
  };

  // Stop mic and streaming
  const stopRecording = async () => {
    // Stop AssemblyAI streaming
    await stop();

    // Stop audio context and tracks
    processorRef.current?.disconnect();
    audioContextRef.current?.close();
    streamRef.current?.getTracks().forEach((track) => track.stop());

    setIsRecording(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        className={`px-6 py-2 rounded bg-blue-600 text-white ${
          isRecording ? "opacity-60" : ""
        }`}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
}
