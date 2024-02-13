import React, { useRef, useEffect } from "react";
import DisplayTrack from "./UI/DisplayTrack";
import AudioControls from "./UI/AudioControls";
import ProgressBar from "./UI/ProgressBar";

interface Book {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  content: string;
  imageLink: string;
  audioLink: string;
  totalRating: number;
  averageRating: number;
  keyIdeas?: string[];
  type: string;
  status: string;
  subscriptionRequired: boolean;
  summary: string;
  tags: string[];
  bookDescription: string;
  authorDescription: string;
  duration: number;
}

interface AudioPlayerProps {
  book: Book | null;
  onAudioEnded: () => void;
}

function AudioPlayer({ book, onAudioEnded }: AudioPlayerProps) {
  const [timeProgress, setTimeProgress] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (book && audioRef.current) {
      audioRef.current.src = book.audioLink;
      audioRef.current.load();
    }
  }, [book]);

  const handleAudioEnded = () => {
    setTimeProgress(0);
    onAudioEnded();
  };

  return (
    <>
      <DisplayTrack {...{ book, audioRef, setDuration, progressBarRef }} />
      <AudioControls
        {...{ audioRef, progressBarRef, duration, setTimeProgress }}
      />
      <ProgressBar {...{ progressBarRef, audioRef, timeProgress, duration }} />
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          setTimeProgress(audioRef.current?.currentTime || 0);
        }}
        onLoadedMetadata={() => {
          setDuration(audioRef.current?.duration || 0);
        }}
        onEnded={handleAudioEnded}
      />
    </>
  );
}

export default AudioPlayer;
