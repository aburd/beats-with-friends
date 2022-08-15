import {Show, onMount, useContext} from "solid-js";
import log from "loglevel";
import {AppContextContext} from "../AppContextProvider";
import MenuButton from "../components/MenuButton";
import "./ProfilePage.css";

export default function ProfilePage() {
  const [appState] = useContext(AppContextContext);

  log.debug(appState);

  return (
    <div class="ProfilePage page">
      <MenuButton />
      <h1>Profile Page</h1>
      <div>Alias: {appState?.user?.name}</div>
      <div>Email: {appState?.fbUser?.email}</div>
      <div><img src={appState?.fbUser?.photoURL || ""} /></div>
    </div>
  );
}
