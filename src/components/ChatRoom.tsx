import { Show, For, createSignal, useContext, createEffect } from "solid-js";
import log from "loglevel";
import { AppContextContext } from "../AppContextProvider";
import { User, Group } from "../types";
import * as api from '../api'
import "./GroupMenu.css"

type ChatRoomProps = {
  group: Group
};

export default function ChatRoom(props: ChatRoomProps) {

  const [formValue, setFormValue] = createSignal('')
  const [appState] = useContext(AppContextContext);

  async function handleSendMessage() { 
    try {
      if (setFormValue) { 
        const message = {
          groupId: props.group?.id,
          id: appState?.user?.id,
          name: appState?.user?.name,
          email: appState?.fbUser?.email,
          photoURL: appState?.fbUser?.photoURL,
          text: formValue(),
        }
        await api.chat.addMessage(message) 
        setFormValue('')
      }
    } catch (e) {
      log.error(e);
    }
  }

  return (
    <div class="ChatRoom">
      <Show when={props.group?.chat}>
        <For each={props.group?.chat?.messages}>
          {(message) => { 
            return (
              <>
                <div>{message.text}</div>
                <div>{new Date(message.createdAt).toString()}</div>
                <div>{message.name}</div>
                <div>{message.email}</div>
                <img src={message.photoURL || '/piano-favicon.ico'} alt="" />
              </>
            )
          }}
        </For>
        <input type="text" name='chat' value={formValue()} onChange={(e) => setFormValue(e.currentTarget.value)} />
        <button onClick={() => handleSendMessage()}></button>
      </Show>
    </div>
  );
}
