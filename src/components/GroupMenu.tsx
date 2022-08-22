import {Show, For, createSignal} from "solid-js";
import log from "loglevel";
import {User} from "../types";
import Modal from "./Modal";
import "./GroupMenu.css"

type GroupMenuProps = {
  userId?: string;
  activeUserId?: string;
  users: User[];
  onPassTurn: (nextUser: User) => void;
};

export default function GroupMenu(props: GroupMenuProps) {
  const [modalShown, setModalShown] = createSignal(false);
  const currentUserIdx = props.users.findIndex(u => u.id === props.activeUserId);
  const currentUser = props.users[currentUserIdx];
  const ownTurn = props.userId === currentUser?.id;
  log.debug({currentUserIdx, currentUser, ownTurn});

  function nextUser(): User | null {
    if (!props.users?.length) return null;

    const nextUserId = (currentUserIdx + 1) % props.users?.length;
    return props.users[nextUserId];
  }

  function handlePassTurnClick() {
    setModalShown(false);
    const next = nextUser();
    if (!next) return;
    props.onPassTurn(next);
  }

  function UserDisplay(user: User) {
    const current = user.id === props.activeUserId;
    return (
      <li class={`user${current ? '-active' : ''}`}>{user.name}</li>
    )
  }

  return (
    <div class="GroupMenu">
      <Show when={modalShown()}>
        <Modal onClose={() => setModalShown(false)}>
          <div>Pass your beat to {nextUser()?.name}?</div>
          <div>
            <button onClick={handlePassTurnClick}>Pass the beat</button>
          </div>
        </Modal>
      </Show>
      <Show when={currentUser}>
        <ul class="user-list">
          <For each={props.users}>
            {UserDisplay}
          </For>
        </ul>
        <Show when={ownTurn}>
          <button class="warning" onClick={() => setModalShown(true)}>Save Beat & Pass</button>
        </Show>
      </Show>
    </div>
  );
}
