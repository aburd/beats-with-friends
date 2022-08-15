import {onMount, useContext, lazy, createSignal, Component} from "solid-js";
import {Routes, Route, NavLink, useNavigate} from "@solidjs/router";
import log from "loglevel";
import {initializeApp} from "firebase/app";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {AppContextContext} from "./AppContextProvider"
import * as api from "./api";
import "./styles";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const GroupsPage = lazy(() => import("./pages/GroupsPage"));
const GroupPage = lazy(() => import("./pages/GroupPage"));
const TurnModePage = lazy(() => import("./pages/TurnModePage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

export const AppRoutes = {
  login: () => "/login",
  groups: {
    index: () => `/groups`,
    show: (id: string) => `/groups/${id}`,
  },
  turnMode: (groupId: string) => `${AppRoutes.groups.show(groupId)}/turn-mode`,
  profile: () => "/profile",
}

function bootstrapApp(setAppContext: Function, navigate: Function, setNavExpanded: Function) {
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
      log.info("User is signed in");
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      // const uid = user.uid;
      // ...
      setAppContext({fbUser: user});
      navigate(AppRoutes.profile(), {replace: true});
    } else {
      // User is signed out
      log.info("User is signed out, rerouting to login");
      setNavExpanded(false);
      navigate(AppRoutes.login(), {replace: true});
    }
  });
}

export default function App() {
  const [navExpanded, setNavExpanded] = createSignal(false);
  const [, setAppContext] = useContext(AppContextContext);
  const navigate = useNavigate();

  function Nav() {
    return (
      <div class="Nav">
        <div class="Nav-top">
          <div class="Nav-btn-container">
            <button class="icon x-circle-close-delete" onClick={() => setNavExpanded(false)} />
          </div>
          <nav>
            <NavLink href={AppRoutes.groups.index()}>Groups</NavLink>
            <NavLink href={AppRoutes.profile()}>Profile</NavLink>
          </nav>
        </div>
        <div class="Nav-bottom">
          <button class="warning" onClick={() => api.auth.signOut()}>Sign Out</button>
        </div>
      </div>
    );
  }

  function wrapWithMenu(component: Component) {
    return () => {
      return <>
        <div class="App-btn-menu">
          <button onClick={() => setNavExpanded(true)}>Menu</button>
        </div>
        {component}
      </>
    }
  }

  onMount(() => {
    bootstrapApp(setAppContext as Function, navigate, setNavExpanded)
  });

  return (
    <div class={`App ${navExpanded() ? "nav-expanded" : ""}`}>
      <Nav />
      <div class="App-body">
        <Routes>
          <Route path={AppRoutes.login()} component={LoginPage} />
          <Route path={AppRoutes.groups.index()} component={wrapWithMenu(GroupsPage)} />
          <Route path={AppRoutes.groups.show(":groupId")} component={wrapWithMenu(GroupPage)} />
          <Route path={AppRoutes.turnMode(":groupId")} component={wrapWithMenu(TurnModePage)} />
          <Route path={AppRoutes.profile()} component={wrapWithMenu(ProfilePage)} />
        </Routes>
      </div>
    </div>
  );
};

