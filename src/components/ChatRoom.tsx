import { Show, For, createSignal, useContext, onMount, createEffect, createResource } from "solid-js";
import log from "loglevel";
import { AppContextContext } from "../AppContextProvider";
import { Chat, Message, MessageParams } from "../types";
import * as api from '../api'
import "./ChatRoom.css"

type ChatRoomProps = {
  chatId?: string
  chat?: Chat
};



export default function ChatRoom(props: ChatRoomProps) {
  let divRef: HTMLDivElement | undefined
  const [formValue, setFormValue] = createSignal('')
  const [appState] = useContext(AppContextContext);
  const [openChatRoom, setOpenChatRoom] = createSignal(true);

  createEffect(async() => { 
    await api.chat.get(props.chatId || '')
  })

  onMount(() => { 
    divRef?.scrollIntoView();
  })

  async function handleSendMessage() { 
    try {
      if (formValue())  {
        const message = {
          chatId: props.chatId,
          id: appState?.user?.id,
          name: appState?.user?.name,
          email: appState?.fbUser?.email,
          photoURL: appState?.fbUser?.photoURL,
          text: formValue(),
        }
        await api.chat.addMessage(message as MessageParams)
        setFormValue('')
      }
    } catch (e) {
      log.error(e);
    } finally { 
      divRef?.scrollIntoView({ behavior: 'smooth', block: "end"});
    }
  }

  function ChatMessage(message: Message) {
    const messageType = message.id === appState?.user?.id ? 'sent' : 'received'
    return (
      <div class="ChatMessage">
        <div class={`message ${messageType}`}>
          <img class="user-photo" src={message.photoURL || '/piano-favicon.ico'} alt="" />
          <p>{message.text}</p>
          <span class="date">{new Date(message.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    )
  }


  return (
    <div class="ChatRoom">
      <button class='toggle-button'onClick={() => setOpenChatRoom(!openChatRoom())}>{ openChatRoom() ? '▼' : '▲'}</button>
      <Show when={props.chatId &&  openChatRoom()}>
        <div class="main">
          <For each={props.chat?.messages}>
            {ChatMessage}
          </For>
          <div ref={divRef} class='main-bottom' />
        </div>
        <div class="footer">
          <input
            type="text"
            name='chat'
            value={formValue()}
            onChange={(e) => setFormValue(e.currentTarget.value)}
            onKeyUp={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={() => handleSendMessage()}>Send</button>
        </div>
      </Show>
    </div>
  );
}
