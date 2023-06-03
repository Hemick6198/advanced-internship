"use client";
/* eslint-disable @next/next/no-img-element */
import SearchBar from "@/app/components/SearchBar";
import SideBar from "@/app/components/SideBar";
import axios from "axios";
import React, { useEffect, useState, useRef, MutableRefObject } from "react";
import { useParams, useRouter } from "next/navigation";
import LogInModal from "@/app/components/UI/LogInModal";
import { useAuthStore } from "../../utilities/authStore";
import BookSkeleton from "@/app/components/UI/BookSkeleton";

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
  duration: any;
  audioRef: MutableRefObject<any | undefined>;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
}

const Page = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [duration, setDuration] = useState(0);
  const modal__dimRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const audioRef = useRef<any | undefined>();
  const authStore = useAuthStore();
  const isUserAuth = authStore.isUserAuth;

  const API__URL = `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${params.id}`;

  const openModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  function handleOverlayClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === modal__dimRef.current) {
      openModal();
    }
  }

  async function fetchBookData(): Promise<void> {
    const { data } = await axios.get(`${API__URL}`);
    setBook(data);
    setIsLoading(false);
  }

  const premiumBookRouting = () => {
    if (isUserAuth === false) {
      openModal();
    } else if (isUserAuth === true && !book?.subscriptionRequired) {
      routeToPlayer();
    }
    // else if (isUserAuth === true && book?.subscriptionRequired) {
    //   if (userSubscription === true) {
    //     routeToPlayer();
    //   } else {
    //     router.push("/choose-plan");
    //   }
    // }
  };

  const routeToPlayer = () => {
    router.push(`/player/${book?.id}`);
  };

  useEffect(() => {
    fetchBookData();
  }, [params.id]);

  const formatTime = (duration: number) => {
    if (duration && !isNaN(duration)) {
      const minutes = Math.floor(duration / 60);
      const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const seconds = Math.floor(duration % 60);
      const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${formatMinutes}:${formatSeconds}`;
    }
    return "00:00";
  };

  const onLoadedMetadata = () => {
    const seconds = audioRef.current.duration;
    setDuration(seconds);
  };

  return (
    <>
      {isModalOpen && (
        <div
          className="modal__dim"
          ref={modal__dimRef}
          onClick={handleOverlayClick}
        >
          <LogInModal openModal={openModal} />
        </div>
      )}
      {isLoading ? (
        <>
          <div className="wrapper">
            <SearchBar />
            <div className="row">
              <div className="container">
                <SideBar />
                <BookSkeleton />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className={`wrapper ${isModalOpen ? "dimmed" : ""}`}>
          <SearchBar />
          <SideBar />
          <div className="row">
            <div className="container">
              <div className="inner__wrapper">
                <div className="inner__book">
                  <div className="inner-book__title">
                    {book?.title}{" "}
                    {book?.subscriptionRequired ? "(Premium)" : ""}
                  </div>
                  <div className="inner-book__author">{book?.author}</div>
                  <div className="inner-book__sub--title">{book?.subTitle}</div>
                  <div className="inner-book__wrapper">
                    <div className="inner-book__description--wrapper">
                      <div className="inner-book__description">
                        <div className="inner-book__icon">
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 1024 1024"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z"></path>
                          </svg>
                        </div>
                        <div className="inner-book__overall--rating">
                          {book?.averageRating}&nbsp;
                        </div>
                        <div className="inner-book__total--rating">
                          ({book?.totalRating}&nbsp;ratings)
                        </div>
                      </div>
                      <div className="inner-book__description">
                        <div className="inner-book__icon">
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 1024 1024"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                            <path d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z"></path>
                          </svg>
                        </div>
                        <audio
                          src={book?.audioLink}
                          ref={audioRef}
                          onLoadedMetadata={onLoadedMetadata}
                          className="no__display"
                        />
                        <div className="inner-book__duration">
                          {formatTime(duration)}
                        </div>
                      </div>
                      <div className="inner-book__description">
                        <div className="inner-book__icon">
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 1024 1024"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M842 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 140.3-113.7 254-254 254S258 594.3 258 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 168.7 126.6 307.9 290 327.6V884H326.7c-13.7 0-24.7 14.3-24.7 32v36c0 4.4 2.8 8 6.2 8h407.6c3.4 0 6.2-3.6 6.2-8v-36c0-17.7-11-32-24.7-32H548V782.1c165.3-18 294-158 294-328.1zM512 624c93.9 0 170-75.2 170-168V232c0-92.8-76.1-168-170-168s-170 75.2-170 168v224c0 92.8 76.1 168 170 168zm-94-392c0-50.6 41.9-92 94-92s94 41.4 94 92v224c0 50.6-41.9 92-94 92s-94-41.4-94-92V232z"></path>
                          </svg>
                        </div>
                        <div className="inner-book__type">{book?.type}</div>
                      </div>
                      <div className="inner-book__description">
                        <div className="inner-book__icon">
                          <svg
                            stroke="currentColor"
                            fill="none"
                            strokeWidth="0"
                            viewBox="0 0 24 24"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            ></path>
                          </svg>
                        </div>
                        <div className="inner-book__key--ideas">
                          {book?.keyIdeas} Key ideas
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="inner-book__read--btn-wrapper">
                    <button
                      className="inner-book__read--btn"
                      onClick={premiumBookRouting}
                    >
                      <div className="inner-book__read--icon">
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 1024 1024"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M928 161H699.2c-49.1 0-97.1 14.1-138.4 40.7L512 233l-48.8-31.3A255.2 255.2 0 0 0 324.8 161H96c-17.7 0-32 14.3-32 32v568c0 17.7 14.3 32 32 32h228.8c49.1 0 97.1 14.1 138.4 40.7l44.4 28.6c1.3.8 2.8 1.3 4.3 1.3s3-.4 4.3-1.3l44.4-28.6C602 807.1 650.1 793 699.2 793H928c17.7 0 32-14.3 32-32V193c0-17.7-14.3-32-32-32zM324.8 721H136V233h188.8c35.4 0 69.8 10.1 99.5 29.2l48.8 31.3 6.9 4.5v462c-47.6-25.6-100.8-39-155.2-39zm563.2 0H699.2c-54.4 0-107.6 13.4-155.2 39V298l6.9-4.5 48.8-31.3c29.7-19.1 64.1-29.2 99.5-29.2H888v488zM396.9 361H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5zm223.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c0-4.1-3.2-7.5-7.1-7.5H627.1c-3.9 0-7.1 3.4-7.1 7.5zM396.9 501H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5zm416 0H627.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5z"></path>
                        </svg>
                      </div>
                      <div className="inner-book__read--text">Read</div>
                    </button>
                    <button
                      className="inner-book__read--btn"
                      onClick={premiumBookRouting}
                    >
                      <div className="inner-book__read--icon">
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 1024 1024"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M842 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 140.3-113.7 254-254 254S258 594.3 258 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 168.7 126.6 307.9 290 327.6V884H326.7c-13.7 0-24.7 14.3-24.7 32v36c0 4.4 2.8 8 6.2 8h407.6c3.4 0 6.2-3.6 6.2-8v-36c0-17.7-11-32-24.7-32H548V782.1c165.3-18 294-158 294-328.1zM512 624c93.9 0 170-75.2 170-168V232c0-92.8-76.1-168-170-168s-170 75.2-170 168v224c0 92.8 76.1 168 170 168zm-94-392c0-50.6 41.9-92 94-92s94 41.4 94 92v224c0 50.6-41.9 92-94 92s-94-41.4-94-92V232z"></path>
                        </svg>
                      </div>
                      <div className="inner-book__read--text">Listen</div>
                    </button>
                  </div>
                  <div className="inner-book__bookmark">
                    <div className="inner-book__bookmark--icon">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 16 16"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"></path>
                      </svg>
                    </div>
                    <div className="inner-book__bookmark--text">
                      Add title to My Library
                    </div>
                  </div>
                  <div className="inner-book__secondary--title">
                    What{"'"}s it about?
                  </div>
                  <div className="inner-book__tags--wrapper">
                    {book?.tags &&
                      book.tags.map((tag: string, index: number) => (
                        <div key={index} className="inner-book__tag">
                          {tag}
                        </div>
                      ))}
                  </div>
                  <div className="inner-book__book--description">
                    {book?.bookDescription}
                  </div>
                  <h2 className="inner-book__secondary--title">
                    About the author
                  </h2>
                  <div className="inner-book__author--description">
                    {book?.authorDescription}
                  </div>
                </div>
                <div className="inner-book--img-wrapper">
                  <figure className="book__image--wrapper">
                    <img
                      className="book__image"
                      style={{ display: "block" }}
                      src={book?.imageLink}
                      alt="book"
                    />
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
