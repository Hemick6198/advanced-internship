"use client";
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import LogInModal from "@/app/components/UI/LogInModal";
import AudioPlayer from "@/app/components/AudioPlayer";
import PlayerSkeleton from "@/app/components/UI/PlayerSkeleton";
import SidebarSizingAndSearchBar from "@/app/components/UI/SidebarSizingAndSearchbar";
import { useBookStore } from "@/app/utilities/bookStore";
import type { RootState } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { toggleModal } from "../../utilities/modalSlice";
import { AppDispatch } from "../../store";
import { initializeAuth } from "../../utilities/authSlice";

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

function Page() {
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { addFinishedBook } = useBookStore();
  const modal__dimRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const API__URL = `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${params.id}`;
  const dispatch: AppDispatch = useDispatch();
  const isUserAuth = useSelector((state: RootState) => state.auth.isUserAuth);
  const isModalOpen = useSelector(
    (state: RootState) => state.modal.isModalOpen
  );

  const getBook = async () => {
    const { data } = await axios.get(API__URL);
    setBook(data);
    setIsLoading(false);
  };

  const openModal = () => {
    dispatch(toggleModal());
  };

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  function handleOverlayClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === modal__dimRef.current) {
      toggleModal();
    }
  }

  useEffect(() => {
    if (isUserAuth === false) {
      toggleModal();
    }
  }, [isUserAuth]);

  useEffect(() => {
    getBook();
  }, []);

  return (
    <>
      <SidebarSizingAndSearchBar />
      {isLoading ? (
        <>
          <PlayerSkeleton />
        </>
      ) : (
        <div
          className={`modal__dim ${isModalOpen ? "dimmed" : ""}`}
          ref={modal__dimRef}
          onClick={handleOverlayClick}
        >
          <div className="summary">
            {isModalOpen ? <LogInModal /> : <></>}
            <div className="audio__book--summary" style={{ fontSize: "16px" }}>
              <div className="audio__book--summary-title">
                <b>{book?.title}</b>
              </div>
              {!isUserAuth ? (
                <>
                  <div className="audio__book--summary-text">
                    {book?.summary.slice(0, 550)} ...
                  </div>
                  <div className="log-in__player--text" onClick={openModal}>
                    {" "}
                    <br /> Please{" "}
                    <u className="log-in__player--underline">Login</u> To
                    Continue Reading
                  </div>
                </>
              ) : (
                <div className="audio__book--summary-text">{book?.summary}</div>
              )}
              <>
                <div className="audio__wrapper">
                  <AudioPlayer
                    book={book}
                    onAudioEnded={() => addFinishedBook(book!.id)}
                  />
                </div>
              </>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Page;
