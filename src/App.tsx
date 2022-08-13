import {onMount, useContext, lazy} from "solid-js";
import {Routes, Route, NavLink, useNavigate} from "@solidjs/router";
import log from "loglevel";
import {initializeApp} from "firebase/app";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {AppContextContext} from "./AppContextProvider"
import "./App.css";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const TurnModePage = lazy(() => import("./pages/TurnModePage"));

export const AppRoutes = {
  login: () => "/login",
  groups: {
    index: () => `/groups`,
    show: (id: string) => `/groups/${id}`,
  },
  turnMode: (groupId: string) => `${AppRoutes.groups.show(groupId)}/turn-mode`,
  profile: () => "/profile",
}

function Nav() {
  return (
    <div class="Nav">
      <nav>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/">Home</NavLink>
      </nav>
    </div>
  );
}

export default function App() {
  const [, setAppContext] = useContext(AppContextContext);
  const navigate = useNavigate();

  onMount(() => {
    if (!setAppContext) {
      log.warn("No firebase app context detected");
      return;
    }
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
    setAppContext({
      fbApp: app,
      fbAuth: auth,
    });
    onAuthStateChanged(auth, (user) => {
      if (user) {
        log.debug("User is signed in");
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // const uid = user.uid;
        // ...
        setAppContext({fbUser: user});
      } else {
        // User is signed out
        log.debug("User is signed out, rerouting to login");
        navigate(AppRoutes.login(), {replace: true});
      }
    });
  })

  return (
    <div class="App">
      <Routes>
        <Route path={AppRoutes.login()} component={LoginPage} />
        <Route path={AppRoutes.turnMode(":groupId")} component={TurnModePage} />
      </Routes>
    </div>
  );
};

