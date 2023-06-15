import { db } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import getStripe from "./initializeStripe";

export default async function createYearlySubscriptionCheckoutSession(
  uid: string
) {
  const firestore = getFirestore();

  const checkoutSessionRef = await addDoc(
    collection(firestore, "users", uid, "checkout_sessions"),
    {
      price: "price_1NFBOaD7glSKtpchYCNoKAEB",
      success_url: window.location.origin + "/success",
      cancel_url: window.location.origin + "/settings",
    }
  );

  onSnapshot(
    doc(firestore, "users", uid, "checkout_sessions", checkoutSessionRef.id),
    async (snap: any) => {
      const { sessionId } = snap.data() as any;
      if (sessionId) {
        const stripe = await getStripe();
        stripe?.redirectToCheckout({ sessionId });
      }
    }
  );
}
