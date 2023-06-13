"use client";
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import React, { useEffect, useState, useRef, MutableRefObject } from "react";
import { useParams, useRouter } from "next/navigation";
import LogInModal from "@/app/components/UI/LogInModal";
import { useAuthStore } from "../../utilities/authStore";
import BookSkeleton from "@/app/components/UI/BookSkeleton";
import {
  AiOutlineBulb,
  AiOutlineClockCircle,
  AiOutlineStar,
} from "react-icons/ai";
import { BiMicrophone } from "react-icons/bi";
import { IoBookOutline, IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import SidebarSizing from "@/app/components/UI/SidebarSizing";
import usePremiumStatus from "@/app/stripe/usePremiumStatus";
import { getAuth } from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/app/firebase";

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
  keyIdeas: string[];
  type: string;
  status: string;
  subscriptionRequired: boolean;
  summary: string;
  tags: string[];
  bookDescription: string;
  authorDescription: string;
  duration: any;
  audioRef: MutableRefObject<any | null>;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
}

const Page = () => {
  let [userIsPremium, setUserIsPremium] = useState<boolean>();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [duration, setDuration] = useState(0);
  const modal__dimRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const audioRef = useRef<any | null>();
  const authStore = useAuthStore();
  const isUserAuth = authStore.isUserAuth;
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const user = getAuth().currentUser;
  userIsPremium = usePremiumStatus(user);

  useEffect(() => {
    fetchBookData();
    checkIfBookIsBookmarked();
  }, [fetchBookData]);

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
    if (!isUserAuth) {
      openModal();
      return;
    }
    if (!book?.subscriptionRequired || userIsPremium) {
      router.push(`/player/${book?.id}`);
      return;
    }
    router.push("/choose-plan");
  };

  useEffect(() => {
    fetchBookData();
  });

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

  const checkIfBookIsBookmarked = async () => {
    try {
      const user = getAuth().currentUser;
      const bookId = params.id;
      if (user) {
        const docRef = doc(db, "users", user.uid, "library", bookId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setIsBookmarked(true);
        } else {
          setIsBookmarked(false);
        }
      }
    } catch (error) {
      console.error("Error checking if book is bookmarked:", error);
    }
  };

  const handleSaveToLibrary = async () => {
    try {
      const user = getAuth().currentUser;
      const bookId = params.id;
      if (user) {
        await setDoc(doc(db, "users", user.uid, "library", bookId), {
          bookId: bookId,
        });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error("Error saving book to library:", error);
    }
  };

  const handleRemoveFromLibrary = async () => {
    try {
      const user = getAuth().currentUser;
      const bookId = params.id;
      if (user) {
        const docRef = doc(db, "users", user.uid, "library", bookId);
        await deleteDoc(docRef);
        setIsBookmarked(false);
      }
    } catch (error) {
      console.error("Error removing book from library:", error);
    }
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
            <SidebarSizing
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />

            <div className="row">
              <div className="container">
                <BookSkeleton />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className={`wrapper ${isModalOpen ? "dimmed" : ""}`}>
          <SidebarSizing
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
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
                          <AiOutlineStar />
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
                          <AiOutlineClockCircle />
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
                          <BiMicrophone />
                        </div>
                        <div className="inner-book__type">{book?.type}</div>
                      </div>
                      <div className="inner-book__description">
                        <div className="inner-book__icon">
                          <AiOutlineBulb />
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
                        <IoBookOutline />
                      </div>
                      <div className="inner-book__read--text">Read</div>
                    </button>
                    <button
                      className="inner-book__read--btn"
                      onClick={premiumBookRouting}
                    >
                      <div className="inner-book__read--icon">
                        <BiMicrophone />
                      </div>
                      <div className="inner-book__read--text">Listen</div>
                    </button>
                  </div>
                  {isUserAuth ? (
                    <div
                      className="inner-book__bookmark"
                      onClick={
                        isBookmarked
                          ? handleRemoveFromLibrary
                          : handleSaveToLibrary
                      }
                    >
                      <div className="inner-book__bookmark--icon">
                        {isBookmarked ? <IoBookmark /> : <IoBookmarkOutline />}
                      </div>
                      <div className="inner-book__bookmark--text">
                        {isBookmarked
                          ? "Book saved!"
                          : "Add title to My Library"}
                      </div>
                    </div>
                  ) : (
                    <div className="inner-book__bookmark" onClick={openModal}>
                      <div className="inner-book__bookmark--icon">
                        {isBookmarked ? <IoBookmark /> : <IoBookmarkOutline />}
                      </div>
                      <div className="inner-book__bookmark--text">
                        {isBookmarked
                          ? "Book saved!"
                          : "Add title to My Library"}
                      </div>
                    </div>
                  )}
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
