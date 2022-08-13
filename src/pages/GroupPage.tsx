import {Show, onMount, onCleanup, createSignal, createResource, useContext, createEffect} from "solid-js";
import log from "loglevel";
import {AppContextContext} from "../AppContextProvider";
import Loader from "../components/Loader";
import ErrorModal from "../components/ErrorModal";
import * as api from "../api";
import "./GroupPage.css";

type GroupPageProps = {};

export default function GroupPage(props: GroupPageProps) {
  const [appState] = useContext(AppContextContext);

  log.debug(appState);

  return (
    <div class="GroupPage page">
      Group Page
    </div>
  );
}
