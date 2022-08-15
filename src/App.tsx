import {Show, JSX, onMount, createEffect, useContext, lazy, createSignal} from "solid-js";
import {Routes, Route, NavLink, useNavigate, useLocation} from "@solidjs/router";
import log from "loglevel";
import {initializeApp} from "firebase/app";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import Loader from "./components/Loader";
import {AppContextContext} from "./AppContextProvider"
import {AppRoutes} from "./routes";
import * as api from "./api";
import * as util from "./util";
import "./styles";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const UserSetupPage = lazy(() => import("./pages/UserSetupPage"));
const GroupsPage = lazy(() => import("./pages/GroupsPage"));
const GroupPage = lazy(() => import("./pages/GroupPage"));
const TurnModePage = lazy(() => import("./pages/TurnModePage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

function bootstrapApp(setAppContext: Function, navigate: Function, pathname: string) {
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
  onAuthStateChanged(auth, async (fbUser) => {
    setAppContext({bootstrapped: true});
    if (!fbUser) {
      // User is signed out
      log.info("User is signed out, rerouting to login");
      util.setNavExpanded(false);
      navigate(AppRoutes.login(), {replace: true});
      return;
    }

    log.info("User is signed in");
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    setAppContext({fbUser});
    const user = await api.user.get(fbUser.uid);
    if (user) {
      setAppContext({user});
      return;
    }
    // There is no matching user, we should set that up
    navigate(AppRoutes.userSetup(), {replace: true});
  });
}

export default function App() {
  const [appState, setAppContext] = useContext(AppContextContext);
  const navigate = useNavigate();
  const location = useLocation();

  function Nav() {
    return (
      <div class="Nav">
        <div class="Nav-top">
          <div class="Nav-btn-container">
            <button class="icon x-circle-close-delete" onClick={() => util.setNavExpanded(false)}>
              <i class="icon x-circle-close-delete" />
            </button>
          </div>
          <nav>
            <NavLink href={AppRoutes.groups.index()} onClick={() => util.setNavExpanded(false)}>Groups</NavLink>
            <NavLink href={AppRoutes.profile()} onClick={() => util.setNavExpanded(false)}>Profile</NavLink>
          </nav>
        </div>
        <div class="Nav-bottom">
          <button class="warning" onClick={() => api.auth.signOut()}>Sign Out</button>
        </div>
      </div>
    );
  }

  onMount(() => {
    bootstrapApp(setAppContext as Function, navigate, location.pathname)
  });

  log.debug(AppRoutes.groups.show(":groupId"));

  return (
    <div class={`App`}>
      <Show when={appState?.bootstrapped} fallback={<Loader loading={!appState?.bootstrapped} />}>
        <Nav />
        <div class="App-body">
          <Routes>
            <Route path={AppRoutes.login()} component={LoginPage} />
            <Route path={AppRoutes.signUp()} component={SignUpPage} />
            <Route path={AppRoutes.userSetup()} component={UserSetupPage} />
            <Route path={AppRoutes.groups.show(":groupId")} component={GroupPage} />
            <Route path={AppRoutes.turnMode(":groupId")} component={TurnModePage} />
            <Route path={AppRoutes.groups.index()} component={GroupsPage} />
            <Route path={AppRoutes.profile()} component={ProfilePage} />
          </Routes>
        </div>
      </Show>
    </div>
  );
};

