import { useEffect, useState, useRef } from "react";
//useRef - react hook to store a reference to a DOM element (media purpose)

export function useMicrophone(onAudioChunk) {
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  //start recording
  const start = async () => {
    try {
      //requesting mic access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      //create a media recoder forr the stream
      const recorder = new window.MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
        audioBitsPerSecond: 16000 * 16,
      });
      mediaRecorderRef.current = recorder;

      //when audio data is available , call the callback with the audio chunk
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0 && onAudioChunk) onAudioChunk(event.data);
      };

      //start recording and emit data every 250ms
      recorder.start(250);
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access is denied or not available");
      console.error("Microphone error: ", err);
    }
  };

  // stop recording and clean up
  const stop = async () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
  };

  //cleanup on unmount
  useEffect(() => {
    return () => stop();
    //enlist disable next line
  }, []);

  return { start, stop, isRecording };
}
