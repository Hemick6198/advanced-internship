"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useAuthStore } from "@/app/utilities/authStore";
import LogInModal from "@/app/components/UI/LogInModal";
import AudioPlayer from "@/app/components/AudioPlayer";
import PlayerSkeleton from "@/app/components/UI/PlayerSkeleton";
import SidebarSizing from "@/app/components/UI/SidebarSizing";
import { useBookStore } from "@/app/utilities/bookStore";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const modal__dimRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const params = useParams();
  const authStore = useAuthStore();
  const isUserAuth = authStore?.isUserAuth;
  const { addFinishedBook } = useBookStore();

  const API__URL = `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${params.id}`;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getBook = async () => {
    const { data } = await axios.get(API__URL);
    setBook(data);
    setIsLoading(false);
  };

  function openModal() {
    setIsModalOpen(!isModalOpen);
  }

  function handleOverlayClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === modal__dimRef.current) {
      openModal();
    }
  }

  useEffect(() => {
    if (isUserAuth === false) {
      openModal();
    }
  }, [isUserAuth]);

  useEffect(() => {
    getBook();
  }, []);

  return (
    <>
      <SidebarSizing
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
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
            {isModalOpen ? <LogInModal openModal={openModal} /> : <></>}
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
