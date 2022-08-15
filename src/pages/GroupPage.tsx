import {Show, For, onMount, onCleanup, createSignal, createResource, useContext, createEffect} from "solid-js";
import {useNavigate, useParams} from "@solidjs/router";
import log from "loglevel";
import {AppContextContext} from "../AppContextProvider";
import Loader from "../components/Loader";
import MenuButton from "../components/MenuButton";
import ErrorModal from "../components/ErrorModal";
import {Group} from "../types";
import * as api from "../api";
import {GroupApiError} from "../api/group";
import "./GroupPage.css";
import {AppRoutes} from "../routes";

type GroupPageProps = {};

export default function GroupPage(props: GroupPageProps) {
  const [appState] = useContext(AppContextContext);
  const [email, setEmail] = createSignal("");
  const [creating, setCreating] = createSignal<boolean>(false);
  const [submitting, setSubmitting] = createSignal<boolean>(false);
  const [groupApiErr, setGroupApiErr] = createSignal<null | GroupApiError>(null);
  const params = useParams();
  const navigate = useNavigate();
  const [group, groupActions] = createResource<Group | null>(() => api.group.get(params.groupId));

  function handleEmailChange(email: string) {
    setEmail(email);
  }

  async function handleInviteSubmit(e: SubmitEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!group()?.id) {
        log.warn(`No group with which to invite to.`);
        return;
      }
      const resGroup = await api.group.addUser(group() as Group, email());
      groupActions.mutate(resGroup);
    } catch (e) {
      setGroupApiErr(e as GroupApiError);
      log.warn('Error inviting member', e);
    } finally {
      setCreating(false);
      setSubmitting(false);
    }
  }

  async function handleSongCreateClick() {
    if (!group()?.id || !appState?.user?.id) {
      log.warn(`No group id or user id to create song with.`);
      return;
    }
    const song = await api.song.create(group()?.id as string, appState?.user?.id);
    log.debug({ song });
    navigate(AppRoutes.turnMode(group()?.id as string));
  }

  return (
    <div class="GroupPage page">
      <MenuButton />
      <Show when={groupApiErr()}>
        <ErrorModal onClose={() => setGroupApiErr(null)} errorCode={groupApiErr()?.code} />
      </Show>
      <section class="GroupPage-header">
        <h1>Group Details</h1>
      </section>
      <section class="GroupPage-info">
        <Show when={!!group()?.id} fallback={<Loader loading={!group()?.id} />}>
          <h3>Name</h3>
          <div>{group()?.name}</div>
          <h3>Members</h3>
          <ul>
            <For each={group()?.users}>
              {(user) => (
                <li>{user.name} {`<${user.email}>`} {user.id === appState?.user?.id ? "(you)" : ""}</li>
              )}
            </For>
          </ul>
        </Show>
      </section>
      <section class="GroupPage-invite">
        <Show when={!!group()?.id && creating()} fallback={
          <button type="submit" class="primary" onClick={() => setCreating(true)}>Invite another member</button>
        }>
          <form onSubmit={handleInviteSubmit}>
            <div class="form-group">
              <label for="email">E-mail address</label>
              <input
                type="text"
                value={email()}
                onKeyUp={e => handleEmailChange(e.currentTarget.value)}
              />
            </div>
            <button type="submit" class="primary">Invite</button>
          </form>
        </Show>
      </section>
      <section class="GroupPage-turn-mode">
        <button class="primary" onClick={handleSongCreateClick}>Work on a song!</button>
      </section>
    </div>
  );
}
