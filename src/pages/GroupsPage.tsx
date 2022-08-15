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
    <div class="card" onClick={() => props.onClick(props.id)}>
      <div>{props.name}</div>
    </div>
  );
}

type GroupsPageProps = {};

export default function GroupsPage(props: GroupsPageProps) {
  const [appState] = useContext(AppContextContext);
  const [groups, groupsActions] = createResource<null | GroupSimple[]>(() => {
    return api.group.index(appState?.fbUser?.uid || "")
  });
  const [creating, setCreating] = createSignal<boolean>(false);
  const [submitting, setSubmitting] = createSignal<boolean>(false);
  const [groupName, setGroupName] = createSignal<string>("");
  const [otherErr, setOtherErr] = createSignal<string>("");
  const [apiErr, setApiError] = createSignal<null | GroupApiError>(null);
  const navigate = useNavigate();

  createEffect(() => {
    if (appState?.fbUser?.uid)
      groupsActions.refetch();
  });

  function handleGroupClick(groupId: string) {
    navigate(AppRoutes.groups.show(groupId));
  }

  createEffect(() => {
    log.debug({ groups: groups() });
  });

  async function handleGroupSubmit(e: SubmitEvent) {
    e.preventDefault();
    setSubmitting(true);
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
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div class="GroupsPage page">
      <MenuButton />
      <Show when={apiErr() || !!otherErr()}>
        <ErrorModal errorCode={apiErr()?.code} onClose={() => {setApiError(null); setOtherErr("");}}>{otherErr()}</ErrorModal>
      </Show>
      <section class="GroupsPage-header">
        <h1>Your Groups</h1>
      </section>
      <section class="GroupsPage-list">
        <Show when={groups()} fallback={<Loader loading={groups.loading} />}>
          {() => groups()?.length ? (
            <For each={groups()}>
              {(group) => (
                <GroupCard {...group} onClick={handleGroupClick} />
              )}
            </For>
          ) : (
            <span>You have no groups. Consider making one!</span>
          )}
        </Show>
      </section>
      <section class="GroupsPage-create">
        <Show when={creating()} fallback={
          <button type="submit" class="primary" onClick={() => setCreating(true)}>Create a New Group</button>
        }>
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
              <button type="submit" class={submitting() ? "warning" : "primary"} disabled={submitting()}>Create!</button>
            </div>
          </form>
        </Show>
      </section>
    </div>
  );
}
