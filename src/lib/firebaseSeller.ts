import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "@/lib/firebase";

const SELLER_APP_NAME = "sellerApp";

const sellerApp = getApps().some((app) => app.name === SELLER_APP_NAME)
    ? getApp(SELLER_APP_NAME)
    : initializeApp(firebaseConfig, SELLER_APP_NAME);

export const sellerAuth = getAuth(sellerApp);
export const sellerDb = getFirestore(sellerApp);
