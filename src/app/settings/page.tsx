"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LogInModal from "../components/UI/LogInModal";
import SidebarSizingAndSearchBar from "../components/UI/SidebarSizingAndSearchbar";
import Skeleton from "../components/UI/Skeleton";
import Link from "next/link";
import type { RootState } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { toggleModal } from "../utilities/modalSlice";
import { AppDispatch } from "../store";
import { initializeAuth } from "../utilities/authSlice";

function UserSettings() {
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const modal__dimRef = useRef<HTMLDivElement>(null);
  const dispatch: AppDispatch = useDispatch();
  const isUserAuth = useSelector((state: RootState) => state.auth.isUserAuth);
  const isModalOpen = useSelector(
    (state: RootState) => state.modal.isModalOpen
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const subscriptionPlan = user?.subscriptionPlan;


  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userEmail = user.email;
        setEmail(userEmail);
      } else {
        setEmail(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [email]);

  const openModal = () => {
    dispatch(toggleModal());
  };

  function handleOverlayClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === modal__dimRef.current) {
      openModal();
    }
  }

  return (
    <div>
      <div className={` ${isModalOpen ? "dimmed" : ""}`}></div>
      {isLoading ? (
        <section>
          <div className="container">
            <div className="row setting__row">
              <div className="section__title page__title">Settings</div>
              <div className="setting__content">
                <div className="settings__sub--title">
                  {" "}
                  <Skeleton width={180} height={22} />{" "}
                </div>
                <div className="settings__text">
                  {" "}
                  <Skeleton width={90} height={22} />
                </div>
                <div className="settings__content"> </div>
                <div className="setting__content">
                  <div className="settings__sub--title">
                    {" "}
                    <Skeleton width={60} height={22} />{" "}
                  </div>
                  <div className="settings__text">
                    {" "}
                    <Skeleton width={190} height={22} />{" "}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <>
          <SidebarSizingAndSearchBar />

          <section>
            <div className="container">
              <div className="row setting__row">
                <div className="section__title page__title">Settings</div>
                {isUserAuth ? (
                  <>
                    {subscriptionPlan ? (
                      <div className="setting__content">
                        <div className="settings__sub--title">
                          Your Subscription plan:
                        </div>
                        <div className="settings__text">Premium</div>
                      </div>
                    ) : (
                      <div className="setting__content">
                        <div className="settings__sub--title">
                          Your Subscription plan
                        </div>
                        <div className="settings__text">Basic</div>
                        <Link
                          href="/choose-plan"
                          className="btn settings__upgrade--btn"
                        >
                          Upgrade to Premium
                        </Link>
                      </div>
                    )}
                    <div className="setting__content">
                      <div className="settings__sub--title">Email:</div>
                      <div className="settings__text">{email}</div>
                    </div>
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
                    <button
                      className="btn settings__login--btn"
                      onClick={openModal}
                    >
                      Login
                    </button>
                  </div>
                )}
              </div>
            </div>
            {isModalOpen && (
              <div
                className="modal__dim"
                ref={modal__dimRef}
                onClick={handleOverlayClick}
              >
                <LogInModal />
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default UserSettings;
