/* eslint-disable @next/next/no-img-element */
import React, { MutableRefObject, useEffect, useState } from "react";
import { AiOutlineClockCircle, AiOutlineStar } from "react-icons/ai";
import { IoTrashOutline } from "react-icons/io5";
import Link from "next/link";

interface SavedBook {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  audioLink: string;
  totalRating: number;
  averageRating: number;
  keyIdeas: number;
  type: string;
  status: string;
  subscriptionRequired: boolean;
  summary: string;
  tags: string[];
  bookDescription: string;
  authorDescription: string;
}

interface SavedBooksProps {
  audioDurations: { [id: string]: number };
  audioRefs: MutableRefObject<{ [id: string]: HTMLAudioElement | null }>;
  onLoadedMetadata: (id: string) => void;
  savedBooks: SavedBook[];
  onMoveToFinished: (bookId: string) => void;
  onDeleteBook: (bookId: string) => void;
}

export default function SavedBooks({
  audioDurations,
  audioRefs,
  onLoadedMetadata,
  savedBooks,
  onDeleteBook,
}: SavedBooksProps) {
  const formatTime = (duration: number | null) => {
    if (duration && !isNaN(duration)) {
      const minutes = Math.floor(duration / 60);
      const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const seconds = Math.floor(duration % 60);
      const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${formatMinutes}:${formatSeconds}`;
    }
    return "00:00";
  };

  const handleDeleteBook = (event: React.MouseEvent, bookId: string) => {
    event.stopPropagation();
    onDeleteBook(bookId);
  };

  return (
    <>
      {savedBooks.map((book) => (
        <div key={book.id} className="for-you__recommended--books-link">
          <a className="trash__icon">
            <IoTrashOutline
              className="delete-icon"
              onClick={(event) => handleDeleteBook(event, book.id)}
            />
          </a>
          <Link href={`/book/${book.id}`}>
            {book.subscriptionRequired && (
              <div className="book__pill">Premium</div>
            )}
            <audio
              src={book.audioLink}
              ref={(audioRef) =>
                (audioRefs.current[`audio_${book.id}`] = audioRef)
              }
              onLoadedMetadata={() => onLoadedMetadata(`audio_${book.id}`)}
              className="no__display"
            />
            <figure className="book__image--wrapper">
              <img className="book__image" src={book.imageLink} alt="book" />
            </figure>
            <div className="recommended__book--title">{book.title}</div>
            <div className="recommended__book--author">{book.author}</div>
            <div className="recommended__book--sub-title">{book.subTitle}</div>
            <div className="recommended__book--details-wrapper">
              <div className="recommended__book--details">
                <div className="recommended__book--details-icon">
                  <AiOutlineClockCircle />
                </div>
                <div className="recommended__book--details-text">
                  {formatTime(audioDurations[`audio_${book.id}`])}
                </div>
              </div>
              <div className="recommended__book--details">
                <div className="recommended__book--details-icon">
                  <AiOutlineStar />
                </div>
                <div className="recommended__book--details-text">
                  {book.averageRating}
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
}
