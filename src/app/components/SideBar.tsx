"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef } from "react";
import LogInModal from "./UI/LogInModal";
import { auth } from "../firebase";
import { useParams, usePathname } from "next/navigation";
import {
  AiOutlineHome,
  AiOutlineQuestionCircle,
  AiOutlineSearch,
} from "react-icons/ai";
import { IoBookmarkOutline } from "react-icons/io5";
import { RiBallPenLine } from "react-icons/ri";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import { BsGear } from "react-icons/bs";
import Link from "next/link";
import { BiDownload, BiUpload } from "react-icons/bi";
import type { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { toggleModal } from "../utilities/modalSlice";
import { setIsUserAuth } from "../utilities/authSlice";

const SideBar = () => {
  const [fontSizeElement, setFontSizeElement] = useState<Element | null>(null);
  const modal__dimRef = useRef<HTMLDivElement>(null);
  const isModalOpen = useSelector(
    (state: RootState) => state.modal.isModalOpen
  );
  const [fontSizes, setFontSizes] = useState("font1");
  const isUserAuth = useSelector((state: RootState) => state.auth.isUserAuth);
  const isSidebarOpen = useSelector(
    (state: RootState) => state.sidebar.isSidebarOpen
  );
  const params = useParams();
  const pathname = usePathname();
  const dispatch = useDispatch();

  function openModal() {
    dispatch(toggleModal());
  }

  function handleOverlayClick(event: any) {
    if (event.target === modal__dimRef.current) {
      openModal();
    }
  }

  function smallFontSize() {
    removeFontSize();
    if (typeof document !== "undefined" && typeof window !== "undefined") {
      const fontSize = document.querySelector(".audio__book--summary-text");
      setFontSizes("font1");
      fontSize?.classList.add("font1");
      setFontSizeElement(fontSize);
    }
  }

  function mediumFontSize() {
    removeFontSize();
    if (typeof document !== "undefined" && typeof window !== "undefined") {
      const fontSize = document.querySelector(".audio__book--summary-text");
      setFontSizes("font2");
      fontSize?.classList.add("font2");
      setFontSizeElement(fontSize);
    }
  }

  function largeFontSize() {
    removeFontSize();
    if (typeof document !== "undefined" && typeof window !== "undefined") {
      const fontSize = document.querySelector(".audio__book--summary-text");
      setFontSizes("font3");
      fontSize?.classList.add("font3");
      setFontSizeElement(fontSize);
    }
  }

  function xlFontSize() {
    removeFontSize();
    if (typeof document !== "undefined" && typeof window !== "undefined") {
      const fontSize = document.querySelector(".audio__book--summary-text");
      setFontSizes("font4");
      fontSize?.classList.add("font4");
      setFontSizeElement(fontSize);
    }
  }

  function removeFontSize() {
    fontSizeElement?.classList.remove("font1");
    fontSizeElement?.classList.remove("font2");
    fontSizeElement?.classList.remove("font3");
    fontSizeElement?.classList.remove("font4");
  }

  const logUserOut = () => {
    auth.signOut();
    setIsUserAuth(false);
  };

  return (
    <>
      {isModalOpen ? <LogInModal /> : <></>}
      <div
        className={`modal__dim ${isModalOpen ? "dimmed" : ""}`}
        ref={modal__dimRef}
        onClick={handleOverlayClick}
      >
        <div className={`sidebar ${isSidebarOpen ? "sidebar--opened" : ""}`}>
          <div className="sidebar__logo">
            <img
              alt=""
              src="https://summarist.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.1b1c490b.png&w=640&q=75"
              decoding="async"
              data-nimg="1"
              loading="lazy"
              style={{ color: "transparent" }}
              width="495"
              height="114"
            />
          </div>
          <div
            className={`sidebar__wrapper ${
              pathname.startsWith("/player/") ? "sidebar__bump-up" : ""
            }`}
          >
            <div className="sidebar__top">
              <Link href="/for-you" className={`sidebar__link--wrapper`}>
                <div
                  className={`sidebar__link--line ${
                    pathname === "/for-you" ? `active--tab` : ""
                  }`}
                ></div>
                <div className="sidebar__icon--wrapper">
                  <AiOutlineHome />
                </div>
                <div className="sidebar__link--text">For You</div>
              </Link>
              <Link className="sidebar__link--wrapper" href="/library">
                <div
                  className={`sidebar__link--line ${
                    pathname === "/library" ? `active--tab` : ""
                  }`}
                ></div>
                <div className="sidebar__icon--wrapper">
                  <IoBookmarkOutline />
                </div>
                <div className="sidebar__link--text">My Library</div>
              </Link>
              <div className="sidebar__link--wrapper sidebar__link--not-allowed">
                <div className={`sidebar__link--line`}></div>
                <div className="sidebar__icon--wrapper">
                  <RiBallPenLine />
                </div>
                <div className="sidebar__link--text">Highlights</div>
              </div>
              <div className="sidebar__link--wrapper sidebar__link--not-allowed">
                <div className="sidebar__link--line "></div>
                <div className="sidebar__icon--wrapper">
                  <AiOutlineSearch />
                </div>
                <div className="sidebar__link--text">Search</div>
              </div>
            </div>
            <div className="sidebar__bottom">
              {pathname === `/player/${params.id}` ? (
                <div className="sidebar__link--wrapper sidebar__font--size-wrapper">
                  <div
                    className={`sidebar__link--text sidebar__font--size-icon sidebar__font--size-icon-small font1 ${
                      fontSizes === "font1"
                        ? "sidebar__font--size-icon--active"
                        : ""
                    }`}
                    onClick={smallFontSize}
                  >
                    <RxLetterCaseCapitalize />
                  </div>
                  <div
                    className={`sidebar__link--text sidebar__font--size-icon sidebar__font--size-icon-medium font2 ${
                      fontSizes === "font2"
                        ? "sidebar__font--size-icon--active"
                        : ""
                    }`}
                    onClick={mediumFontSize}
                  >
                    <RxLetterCaseCapitalize />
                  </div>
                  <div
                    className={`sidebar__link--text sidebar__font--size-icon sidebar__font--size-icon-large font3 ${
                      fontSizes === "font3"
                        ? "sidebar__font--size-icon--active"
                        : ""
                    }`}
                    onClick={largeFontSize}
                  >
                    <RxLetterCaseCapitalize />
                  </div>
                  <div
                    className={`sidebar__link--text sidebar__font--size-icon sidebar__font--size-icon-xlarge font4 ${
                      fontSizes === "font4"
                        ? "sidebar__font--size-icon--active"
                        : ""
                    }`}
                    onClick={xlFontSize}
                  >
                    <RxLetterCaseCapitalize />
                  </div>
                </div>
              ) : null}
              <Link className="sidebar__link--wrapper" href="/settings">
                <div
                  className={`sidebar__link--line ${
                    pathname === `/settings` ? `active--tab` : ""
                  }`}
                ></div>
                <div className="sidebar__icon--wrapper">
                  <BsGear />
                </div>
                <div className="sidebar__link--text">Settings</div>
              </Link>
              <div className="sidebar__link--wrapper sidebar__link--not-allowed">
                <div className="sidebar__link--line "></div>
                <div className="sidebar__icon--wrapper">
                  <AiOutlineQuestionCircle />
                </div>
                <div className="sidebar__link--text">Help &amp; Support</div>
              </div>
              <div>
                {isUserAuth === true ? (
                  <div className="sidebar__link--wrapper" onClick={logUserOut}>
                    <div className="sidebar__link--line "></div>
                    <div className="sidebar__icon--wrapper">
                      <div className="rotate-90">
                        <BiUpload />
                      </div>
                    </div>
                    <div className="sidebar__link--text">Logout</div>
                  </div>
                ) : (
                  <div className="sidebar__link--wrapper" onClick={openModal}>
                    <div className="sidebar__link--line "></div>
                    <div className="sidebar__icon--wrapper">
                      <div className="rotate-90">
                        <BiDownload />
                      </div>
                    </div>
                    <div className="sidebar__link--text">Log In</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
