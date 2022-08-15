import {Show, onMount, useContext} from "solid-js";
import log from "loglevel";
import {AppContextContext} from "../AppContextProvider";
import Loader from "../components/Loader";
import ErrorModal from "../components/ErrorModal";
import * as api from "../api";
import "./ProfilePage.css";

type ProfilePageProps = {};

export default function ProfilePage(props: ProfilePageProps) {
  const [appState] = useContext(AppContextContext);

  log.debug(appState);

  return (
    <div class="ProfilePage page">
      <Show when={appState?.fbUser} >
      <h1>Profile Page</h1>
      <div>Email: {appState?.fbUser?.email}</div>
      <div><img src={appState?.fbUser?.photoURL || ""} /></div>
    </Show>
    </div>
  );
}
