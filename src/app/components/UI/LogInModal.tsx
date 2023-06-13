/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  sendPasswordResetEmail,
} from "firebase/auth";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuthStore } from "@/app/utilities/authStore";
import { useEmailStore } from "@/app/utilities/emailStore";
import { BsFillPersonFill } from "react-icons/bs";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { FaSpinner } from "react-icons/fa";

function LogInModal({ openModal }: { openModal: any }) {
  const authStore = useAuthStore();
  const emailStore = useEmailStore();
  const auth = getAuth();
  const [guestLoading, setGuestLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [emailLoading, setEmailLoading] = useState<boolean>(false);
  const [emailSignUpLoading, setEmailSignUpLoading] = useState<boolean>(false);
  const [passwordReset, setPasswordReset] = useState<boolean>(false);
  const [logInModal, setLogInModal] = useState(true);
  const [signUpModal, setSignUpModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailSignUp = async (e: any) => {
    try {
      setEmailSignUpLoading(true);
      e.preventDefault();
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        loginAuthSuccess();
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          uid: user.uid,
        });
      }
      openModal();
      stopLoading();
    } catch (error) {
      stopLoading();
      alert(error);
    }
  };

  const emailLogIn = async (e: any) => {
    e.preventDefault();
    try {
      setEmailLoading(true);
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user)
      if (user) {
        loginAuthSuccess();
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          uid: user.uid,
        });
      }
      openModal();
      stopLoading();
    } catch (error) {
      stopLoading();
      alert(error);
    }
  };

  const guestLogIn = async (e: any) => {
    e.preventDefault();
    try {
      setGuestLoading(true);
      await setPersistence(auth, browserLocalPersistence);
      const email = "guest@gmail.com";
      const password = "guest123";
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        loginAuthSuccess();
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          uid: user.uid,
        });
      }
      openModal();
      stopLoading();
    } catch (error) {
      stopLoading();
      alert(error);
    }
  };

  const googleLogIn = async (e: any) => {
    try {
      setGoogleLoading(true);
      await setPersistence(auth, browserLocalPersistence);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      const user = auth.currentUser;
      if (user) {
        loginAuthSuccess();
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          uid: user.uid,
        });
      }
      openModal();
      stopLoading();
    } catch (error) {
      stopLoading();
      alert(error);
    }
  };

  const sendPasswordReset = async (e: any) => {
    e.preventDefault();
    try {
      setPasswordReset(true);
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email).then(() => {
        alert("Password reset email sent!");
      });
      swapToLogInModal();
    } catch (error) {
      stopLoading();
      alert(error);
    }
  };

  const loginAuthSuccess = () => {
    const user = getAuth().currentUser;
    authStore.setIsUserAuth(true);
    emailStore.setEmail(user?.email || "");
  };

  function stopLoading() {
    setGuestLoading(false);
    setGoogleLoading(false);
    setEmailLoading(false);
    setEmailSignUpLoading(false);
  }

  function swapToLogInModal() {
    if (logInModal === false) {
      setSignUpModal(false);
      setPasswordModal(false);
      setLogInModal(true);
    } else {
      setPasswordModal(false);
      setLogInModal(false);
      setSignUpModal(true);
    }
  }

  function swapToSignUpModal() {
    if (signUpModal === false) {
      setLogInModal(false);
      setSignUpModal(true);
    } else {
      setSignUpModal(false);
      setLogInModal(true);
    }
  }

  function swapToPasswordModal() {
    if (passwordModal === false) {
      setLogInModal(false);
      setPasswordModal(true);
    } else {
      setPasswordModal(false);
      setLogInModal(true);
    }
  }

  return (
    <div className="auth">
      {logInModal && (
        <>
          <div className="auth__content">
            <div className="auth__title">Log in to Summarist</div>
            <button className="btn guest__btn--wrapper" onClick={guestLogIn}>
              <figure className="google__icon--mask guest__icon--mask">
                <BsFillPersonFill />
              </figure>
              {guestLoading ? (
                <div className="log__in--spinner">
                  <FaSpinner />
                </div>
              ) : (
                <div>Login as a Guest</div>
              )}
            </button>
            <div className="auth__separator">
              <span className="auth__separator--text">or</span>
            </div>
            <button className="btn google__btn--wrapper" onClick={googleLogIn}>
              <figure className="google__icon--mask">
                <img
                  alt="google"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1024px-Google_%22G%22_Logo.svg.png?20230305195327"
                  decoding="async"
                  data-nimg="1"
                  loading="lazy"
                  width="100"
                  style={{ color: "transparent" }}
                  height="100"
                />
              </figure>
              {googleLoading ? (
                <div className="log__in--spinner">
                  <FaSpinner />
                </div>
              ) : (
                <div>Login with Google</div>
              )}
            </button>
            <div className="auth__separator">
              <span className="auth__separator--text">or</span>
            </div>
            <form
              id="log__in--form"
              className="auth__main--form"
              onSubmit={emailLogIn}
            >
              <input
                className="auth__main--input"
                type="text"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
              <input
                className="auth__main--input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
              <button className="btn" type="submit">
                {emailLoading ? (
                  <div className="log__in--spinner">
                    <FaSpinner />
                  </div>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </form>
          </div>
          <div className="auth__forgot--password" onClick={swapToPasswordModal}>
            Forgot your password?
          </div>
          <button className="auth__switch--btn" onClick={swapToLogInModal}>
            Don{`'`}t have an account?
          </button>
          <div className="auth__close--btn" onClick={openModal}>
            <AiOutlineClose />
          </div>
        </>
      )}
      {signUpModal && (
        <>
          <div className="auth__content">
            <div className="auth__title">Sign up to Summarist</div>
            <button className="btn google__btn--wrapper" onClick={googleLogIn}>
              <figure className="google__icon--mask">
                <img
                  alt="google"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1024px-Google_%22G%22_Logo.svg.png?20230305195327"
                  decoding="async"
                  data-nimg="1"
                  loading="lazy"
                  style={{ color: "transparent" }}
                  width="100"
                  height="100"
                ></img>
              </figure>
              {googleLoading ? (
                <div className="log__in--spinner">
                  <FaSpinner />
                </div>
              ) : (
                <div>Sign up with Google</div>
              )}
            </button>
            <div className="auth__separator">
              <span className="auth__separator--text">or</span>
            </div>
            <form
              id="sign__up--form"
              className="auth__main--form"
              onSubmit={emailSignUp}
            >
              <input
                className="auth__main--input"
                type="email"
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
              />{" "}
              <input
                className="auth__main--input"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="btn" type="submit">
                {emailSignUpLoading ? (
                  <div className="log__in--spinner">
                    <FaSpinner />
                  </div>
                ) : (
                  <span>Sign up</span>
                )}
              </button>
            </form>
          </div>
          <button className="auth__switch--btn" onClick={swapToSignUpModal}>
            Already have an account?
          </button>
          <div className="auth__close--btn" onClick={openModal}>
            <AiOutlineClose />
          </div>
        </>
      )}
      {passwordModal && (
        <>
          <div className="auth__content">
            <div className="auth__title">Reset your password</div>
            <form
              id="forgot-password__form"
              className="auth__main--form"
              onSubmit={swapToLogInModal}
            >
              <input
                className="auth__main--input"
                type="text"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn" onClick={sendPasswordReset}>
                {passwordReset ? (
                  <>
                    <AiOutlineCheck />
                  </>
                ) : (
                  <span>Send reset password link</span>
                )}
              </button>
            </form>
          </div>
          <button className="auth__switch--btn" onClick={swapToLogInModal}>
            Go to login
          </button>
          <div className="auth__close--btn" onClick={openModal}>
            <AiOutlineClose />
          </div>
        </>
      )}
    </div>
  );
}

export default LogInModal;
