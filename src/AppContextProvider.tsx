import {createContext, JSX} from "solid-js";
import {SetStoreFunction} from "solid-js/store";
import {createStore} from "solid-js/store";
import {FirebaseApp} from "firebase/app";
import {User, Auth} from "firebase/auth";

type AppStore = {
  fbApp: FirebaseApp | null;
  fbAuth: Auth | null;
  fbUser: User | null;
}

type AppContext = [AppStore, SetStoreFunction<AppStore>?];

type AppContextProviderProps = {
  children: JSX.Element,
} & AppStore;

export const AppContextContext = createContext<AppContext>([{
  fbApp: null,
  fbAuth: null,
  fbUser: null,
}]);

export default function AppContextProvider(props: AppContextProviderProps) {
  const [state, setState] = createStore(
    {
      fbApp: props.fbApp,
      fbAuth: props.fbAuth,
      fbUser: props.fbUser,
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
