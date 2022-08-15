import {Show, For, onMount, onCleanup, createSignal, createResource, useContext, createEffect} from "solid-js";
import {useRouteData} from "@solidjs/router";
import log from "loglevel";
import {AppContextContext} from "../AppContextProvider";
import Loader from "../components/Loader";
import ErrorModal from "../components/ErrorModal";
import {Group} from "../types";
import * as api from "../api";
import "./GroupsPage.css";

type GroupCardProps = Group;

function GroupCard(props: GroupCardProps) {
  return (
    <div class="GroupCard">
      <div>{props.id}</div>
      <div>{props.name}</div>
    </div>
  );
}

type GroupsPageProps = {};

export default function GroupsPage(props: GroupsPageProps) {
  const [appState] = useContext(AppContextContext);
  const [groups, setGroups] = createSignal<null | Group[]>(null);

  createEffect(async () => {
    if (appState?.user) {
      const groups = await api.group.index(appState?.user?.id);
      log.debug(groups);
      setGroups(groups);
    }
  });

  return (
    <div class="GroupsPage page">
      <h1>Your Groups</h1>
      <Show when={groups} fallback={<Loader loading={!groups} />}>
        <section class="Group-list"></section>
        <For each={groups()}>
          {(group) => (
            <GroupCard {...group} />
          )}
        </For>
      </Show>
    </div>
  );
}
