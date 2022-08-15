import {createContext, JSX} from "solid-js";
import {SetStoreFunction} from "solid-js/store";
import {createStore} from "solid-js/store";
import {FirebaseApp} from "firebase/app";
import {User as FbUser, Auth} from "firebase/auth";
import {User} from "./types";

type AppStore = {
  fbApp: FirebaseApp | null;
  fbAuth: Auth | null;
  fbUser: FbUser | null;
  user: User | null;
  bootstrapped: boolean; 
}

type AppContext = [AppStore, SetStoreFunction<AppStore>?];

type AppContextProviderProps = {
  children: JSX.Element,
} & AppStore;

export const AppContextContext = createContext<AppContext>([{
  fbApp: null,
  fbAuth: null,
  fbUser: null,
  user: null,
  bootstrapped: false,
}]);

export default function AppContextProvider(props: AppContextProviderProps) {
  const [state, setState] = createStore(
    {
      fbApp: props.fbApp,
      fbAuth: props.fbAuth,
      fbUser: props.fbUser,
      user: props.user,
      bootstrapped: false,
    },
    {name: "app-context"}
  );
  const appContext: AppContext = [
    state,
    setState,
  ];

  return (
    <AppContextContext.Provider value={appContext}>
      {props.children}
    </AppContextContext.Provider>
  );
}
