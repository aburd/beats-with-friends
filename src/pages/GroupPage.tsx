import {Show, For, onMount, onCleanup, createSignal, createResource, useContext, createEffect} from "solid-js";
import {useParams, useRouteData, useLocation, useMatch} from "@solidjs/router";
import log from "loglevel";
import {AppContextContext} from "../AppContextProvider";
import Loader from "../components/Loader";
import MenuButton from "../components/MenuButton";
import ErrorModal from "../components/ErrorModal";
import {Group} from "../types";
import * as api from "../api";
import "./GroupPage.css";

type GroupPageProps = {};

export default function GroupPage(props: GroupPageProps) {
  const [appState] = useContext(AppContextContext);
  const [email, setEmail] = createSignal("");
  const params = useParams();
  const location = useLocation();
  const data = useRouteData();
  const [group, groupActions] = createResource<Group | null>(() => api.group.get(params.groupId));

  createEffect(() => {
    log.debug({ groupId: params.groupId });
    log.debug(window.location);
    log.debug({group: group()?.name});
  });

  function handleEmailChange(email: string) {
    setEmail(email);
  }

  async function handleInviteSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!group()?.id) {
      log.warn(`No group with which to invite to.`);
      return;
    }
    const resGroup = await api.group.addUser(group()?.id || "", email());
    groupActions.mutate(resGroup);
  }

  return (
    <div class="GroupPage page">
      <MenuButton />
      <Show when={!!group()?.id} fallback={<Loader loading={!group()?.id} />}>
        <section class="GroupPage-info">
          <h1>{group()?.name}</h1>
          <h2>Members</h2>
          <For each={group()?.users}>
            {(user) => (
              <div>{user.name}</div>
            )}
          </For>
        </section>
        <section class="GroupPage-invite">
          <h3>Invite another member</h3>
          <form onSubmit={handleInviteSubmit}>
            <div class="form-group">
              <label for="email">E-mail address</label>
              <input
                type="text"
                value={email()}
                onKeyUp={e => handleEmailChange(e.currentTarget.value)}
              />
            </div>
            <button type="submit">Invite</button>
          </form>
        </section>
        <section class="GroupPage-turn-mode">
          <button >Work on a song!</button>
        </section>
      </Show>
    </div>
  );
}
