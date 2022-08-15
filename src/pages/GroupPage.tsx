import {Show, For, onMount, onCleanup, createSignal, createResource, useContext, createEffect} from "solid-js";
import {useRouteData} from "@solidjs/router";
import log from "loglevel";
import {AppContextContext} from "../AppContextProvider";
import Loader from "../components/Loader";
import ErrorModal from "../components/ErrorModal";
import {Group} from "../types";
import * as api from "../api";
import "./GroupPage.css";

type GroupCardProps = Group;

function GroupCard(props: GroupCardProps) {
  return (
    <div class="GroupCard">
      <div>{props.id}</div>
      <div>{props.name}</div>
    </div>
  );
}

type GroupPageProps = {};

export default function GroupPage(props: GroupPageProps) {
  const [appState] = useContext(AppContextContext);
  const {params} = useRouteData();
  const [groups, groupActions] = createResource(() => api.group.index(params.groupId));

  log.debug({appState});
  log.debug({params});

  return (
    <div class="GroupPage page">
      <h1>Your Groups</h1>
      <Show when={!groups.loading} fallback={<Loader loading={groups.loading} />}>
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
