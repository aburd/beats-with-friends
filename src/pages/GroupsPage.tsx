import {Show, For, onMount, onCleanup, createSignal, createResource, useContext, createEffect} from "solid-js";
import {useNavigate} from "@solidjs/router";
import log from "loglevel";
import {AppContextContext} from "../AppContextProvider";
import Loader from "../components/Loader";
import MenuButton from "../components/MenuButton";
import {AppRoutes} from "../routes";
import ErrorModal from "../components/ErrorModal";
import {GroupSimple} from "../types";
import * as api from "../api";
import {GroupApiError} from "../api/group";
import "./GroupsPage.css";

type GroupCardProps = {
  onClick: (groupId: string) => void;
} & GroupSimple;

function GroupCard(props: GroupCardProps) {
  return (
    <div class="GroupCard" onClick={() => props.onClick(props.id)}>
      <div>{props.id}</div>
      <div>{props.name}</div>
    </div>
  );
}

type GroupsPageProps = {};

export default function GroupsPage(props: GroupsPageProps) {
  const [appState] = useContext(AppContextContext);
  const [groups, setGroups] = createSignal<null | GroupSimple[]>(null);
  const [groupName, setGroupName] = createSignal<string>("");
  const [otherErr, setOtherErr] = createSignal<string>("");
  const [apiErr, setApiError] = createSignal<null | GroupApiError>(null);
  const navigate = useNavigate();

  createEffect(async () => {
    if (appState?.user) {
      const groups = await api.group.index(appState?.user?.id);
      log.debug(groups);
      setGroups(groups);
    }
  });

  function handleGroupClick(groupId: string) {
    navigate(AppRoutes.groups.show(groupId));
  }

  async function handleGroupSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!appState?.user?.id) {
      log.error(`This state should not be reached. There may be an issue with firebase.`);
      return;
    }
    if (!groupName()) {
      setOtherErr("Group Name is required to create a group");
      return;
    }
    try {
      const group = await api.group.create([appState?.user?.id], groupName());
      navigate(AppRoutes.groups.show(group.id));
    } catch (e) {
      log.error(e);
      setApiError(e as GroupApiError);
    }
  }

  return (
    <div class="GroupsPage page">
      <MenuButton />
      <Show when={apiErr() || !!otherErr()}>
        <ErrorModal errorCode={apiErr()?.code} onClose={() => {setApiError(null); setOtherErr("");}}>{otherErr()}</ErrorModal>
      </Show>
      <h1>Your Groups</h1>
      <Show when={groups} fallback={<Loader loading={!groups} />}>
        <section class="Group-list">
          <For each={groups()}>
            {(group) => (
              <GroupCard {...group} onClick={handleGroupClick} />
            )}
          </For>
        </section>
        <section class="GroupsPage-create">
          <form onSubmit={handleGroupSubmit}>
            <div class="form-group">
              <label for="group-name">New Group Name</label>
              <input
                type="text"
                value={groupName()}
                onKeyUp={(e) => setGroupName(e.currentTarget.value)}
              />
            </div>
            <div class="form-group">

              <button type="submit" class="primary">Create a New Group</button>
            </div>
          </form>
        </section>
      </Show>
    </div>
  );
}
