/* eslint-disable @next/next/no-img-element */
import React, { MutableRefObject } from "react";

interface AudioPlayerProps {
  book: any;
  audioRef: MutableRefObject<any>;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  progressBarRef: MutableRefObject<any>;
}

const DisplayTrack = ({
  book,
  audioRef,
  setDuration,
}: AudioPlayerProps) => {

  const onLoadedMetadata = () => {
  const seconds = audioRef.current.duration;
  setDuration(seconds);
};

  return (
    <div>
      <audio
        src={book?.audioLink}
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
      />
      <div className="audio__track--wrapper">
        <figure className="audio__track--image-mask">
          <figure
            className="book__image--wrapper"
            style={{
              height: "48px",
              width: "48px",
              minWidth: "48px",
              display: "flex",
              minHeight: "48px",
            }}
          >
            <img
              className="book__image"
              style={{ display: "block" }}
              src={book?.imageLink}
              loading="lazy"
              alt="book"
            />
          </figure>
        </figure>
        <div className="audio__track--details-wrapper">
          <div className="audio__track--title">{book?.title}</div>
          <div className="audio__track--author">{book?.author}</div>
        </div>
      </div>
    </div>
  );
};

export default DisplayTrack;
