import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

export default {
  init() {
    // See: https://firebase.google.com/docs/web/learn-more#config-object
    //import.meta.env.VITE_SOME_KEY
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FB_API_KEY,
      authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
      // The value of `databaseURL` depends on the location of the database
      databaseURL: import.meta.env.VITE_FB_DB_URL,
      projectId: import.meta.env.VITE_FB_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FB_BUCKET_URL,
      // messagingSenderId: "SENDER_ID",
      // appId: "APP_ID",
      // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
      // measurementId: "G-MEASUREMENT_ID",
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const storage = getStorage(app);
    return { app, auth, storage };
  },
};
