import {onMount, useContext} from "solid-js";
import log from "loglevel";
import {initializeApp} from "firebase/app";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {AppContextContext} from "./AppContextProvider"
import TurnModePage from "./pages/TurnModePage";
import "./App.css";

// See: https://firebase.google.com/docs/web/learn-more#config-object
//import.meta.env.VITE_SOME_KEY
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  // The value of `databaseURL` depends on the location of the database
  databaseURL: import.meta.env.VITE_FB_DB_URL,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  // storageBucket: "PROJECT_ID.appspot.com",
  // messagingSenderId: "SENDER_ID",
  // appId: "APP_ID",
  // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
  // measurementId: "G-MEASUREMENT_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

export default function App() {
  const [, setAppContext] = useContext(AppContextContext);
  onMount(() => {
    if (!setAppContext) {
      log.warn("No firebase app context detected");
      return;
    }
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // const uid = user.uid;
        // ...
        setAppContext({ fbUser: user });
      } else {
        // User is signed out
        // ...
      }
    });
  })

  return (
    <div class="App">
      <TurnModePage />
    </div>
  );
};

