import {Show, onMount, onCleanup, createSignal, createResource, useContext, createEffect} from "solid-js";
import log from "loglevel";
import {AppContextContext} from "../AppContextProvider";
import Loader from "../components/Loader";
import ErrorModal from "../components/ErrorModal";
import * as api from "../api";
import "./GroupsPage.css";

type GroupsPageProps = {};

export default function GroupsPage(props: GroupsPageProps) {
  const [appState] = useContext(AppContextContext);

  log.debug(appState);

  return (
    <div class="GroupsPage page">
      Groups Page
    </div>
  );
}
