"use client";
/* eslint-disable @next/next/no-img-element */
import React, {
  useState,
  useEffect,
  MutableRefObject,
  useRef,
} from "react";
import SavedBooks from "../components/SavedBooks";
import SidebarSizingAndSearchBar from "../components/UI/SidebarSizingAndSearchbar";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";
import { db } from "../firebase";
import { useBookStore } from "../utilities/bookStore";
import LogInModal from "../components/UI/LogInModal";
import RecommendedSkeleton from "../components/UI/RecommendedSkeleton";
import { Skeleton } from "@mui/material";
import type { RootState } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { toggleModal } from "../utilities/modalSlice";
import { AppDispatch } from "../store";
import { initializeAuth } from "../utilities/authSlice";

function Library() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [savedBooks, setSavedBooks] = useState<any[]>([]);
  const [savedBookIds, setSavedBookIds] = useState<string[]>([]);
  const dispatch: AppDispatch = useDispatch();
  const isUserAuth = useSelector((state: RootState) => state.auth.isUserAuth);
  const isModalOpen = useSelector(
    (state: RootState) => state.modal.isModalOpen
  );
  const [audioDurations, setAudioDurations] = useState<{
    [id: string]: number;
  }>({});
  const audioRefs: MutableRefObject<{ [id: string]: HTMLAudioElement | null }> =
    useRef({});
  const { addFinishedBook } = useBookStore();
  const modal__dimRef = useRef(null);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const openModal = () => {
    dispatch(toggleModal());
  };

  useEffect(() => {
    const fetchSavedBooks = async () => {
      try {
        setIsLoading(true);
        const auth = getAuth();
        await setPersistence(auth, browserSessionPersistence);
        const user = auth.currentUser;
        if (user) {
          const collectionRef = collection(db, "users", user.uid, "library");
          const querySnapshot = await getDocs(collectionRef);
          const ids = querySnapshot.docs.map((doc) =>
            doc.id.replace(/[^a-zA-Z0-9]/g, "")
          );
          setSavedBookIds(ids);
        }
      } catch (error) {
        console.error("Error fetching saved book IDs:", error);
      }
    };

    fetchSavedBooks();
  }, [isUserAuth]);

  useEffect(() => {
    if (savedBookIds.length === 0) {
      setIsLoading(false);
      return;
    }

    const fetchBooksData = async () => {
      try {
        setIsLoading(true);
        const bookPromises = savedBookIds.map(async (bookId) => {
          const response = await fetch(
            `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${bookId}`
          );
          const responseData = await response.text();

          if (responseData.trim() === "") {
            return null;
          }

          let bookData;
          try {
            bookData = JSON.parse(responseData);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            return null;
          }

          return { ...bookData, id: bookId };
        });

        const books = await Promise.all(bookPromises);
        setSavedBooks(books);
      } catch (error) {
        console.error("Error fetching saved books:", error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooksData();
  }, [savedBookIds]);

  function handleOverlayClick(event: any) {
    if (event.target === modal__dimRef.current) {
      dispatch(toggleModal());
    }
  }

  const onLoadedMetadata = (id: string) => {
    const seconds = audioRefs.current[id]?.duration || 0;
    setAudioDurations((prevDurations) => ({
      ...prevDurations,
      [id]: seconds,
    }));
  };

  const moveBookToFinished = (bookId: string) => {
    const bookIndex = savedBooks.findIndex((book) => book.id === bookId);
    if (bookIndex !== -1) {
      const book = savedBooks[bookIndex];
      addFinishedBook(book.id);
      setSavedBooks((prevSavedBooks) =>
        prevSavedBooks.filter((book) => book.id !== bookId)
      );
    }
  };

  const onDeleteBook = async (bookId: string) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const bookRef = doc(db, "users", user.uid, "library", bookId);
        await deleteDoc(bookRef);
        setSavedBooks((prevSavedBooks) =>
          prevSavedBooks.filter((book) => book.id !== bookId)
        );
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div className="wrapper">
      <SidebarSizingAndSearchBar />
      <div className="row">
        <div className="container">
          {isUserAuth ? (
            <>
              <div className="for-you__title">Saved Books</div>
              {isLoading ? (
                <>
                  <div className="for-you__sub--title">
                    <Skeleton width={50} height={24} />{" "}
                  </div>
                  <div className="saved__books">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        className="for-you__recommended--books-link"
                        key={index}
                      >
                        <RecommendedSkeleton />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="for-you__sub--title">
                    {savedBooks.length}{" "}
                    {savedBooks.length === 1 ? "item" : "items"}
                  </div>
                  <div className="saved__books">
                    <SavedBooks
                      savedBooks={savedBooks}
                      audioDurations={audioDurations}
                      audioRefs={audioRefs}
                      onLoadedMetadata={onLoadedMetadata}
                      onMoveToFinished={moveBookToFinished}
                      onDeleteBook={onDeleteBook}
                    />
                  </div>
                  <div className="for-you__title">Finished</div>
                  <div className="for-you__sub--title">0 Items</div>
                  <div className="saved__books"></div>
                </>
              )}
            </>
          ) : (
            <div className="settings__login--wrapper">
              <img
                alt="login"
                src="https://summarist.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogin.e313e580.png&w=1080&q=75"
                decoding="async"
                data-nimg="1"
                loading="lazy"
                width="1033"
                height="712"
              />
              <div className="settings__login--text">
                Log in to your account to see your details.
              </div>
              <button className="btn settings__login--btn" onClick={openModal}>
                Login
              </button>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div
          className="dimmed"
          ref={modal__dimRef}
          onClick={handleOverlayClick}
        >
          <LogInModal />
        </div>
      )}
    </div>
  );
}

export default Library;
