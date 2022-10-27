import {
  Show,
  createSignal,
  createResource,
  useContext,
  createEffect,
} from "solid-js";
import log from "loglevel";
import { useParams } from "@solidjs/router";
import { AppContextContext } from "../AppContextProvider";
import ChatRoom from '@/components/ChatRoom'
import Sequencer from "@/components/Sequencer";
import Loader from "@/components/Loader";
import MenuButton from "@/components/MenuButton";
import ErrorModal from "@/components/ErrorModal";
import GroupMenu from "@/components/GroupMenu";
import * as api from "@/api";
import { ApiSong } from "@/api/types";
import audio from "@/audio";
import { User, Group, Chat } from "@/types";
import "./TurnModePage.css";

export default function TurnModePage() {
  const params = useParams();
  const [initialized, setInitialized] = createSignal(false);
  const [initErr, setInitErr] = createSignal<string | null>(null);
  const [group, groupActions] = createResource<Group | null>(() =>
    api.group.get(params.groupId)
  );
  const [chat, setChat] = createSignal<Chat | null>(null)
  const [appState] = useContext(AppContextContext);

  log.debug(appState);

  async function fetchSong(group: Group): Promise<ApiSong | null> {
    log.debug({ group });
    if (!group?.turnMode) return null;

    try {
      const song = await api.song.get(group.turnMode?.songId);
      if (!song) throw Error("No song in database");

      return song;
    } catch (e) {
      log.error(e);
      setInitErr("There was an error loading turn mode");
      throw e;
    }
  }

  createEffect(async() => { 
    const chat = await api.chat.get(group()?.id|| '')
    setChat(chat)
  })

  createEffect(async () => {
    const song = await fetchSong(group() as Group);
    if (!song) {
      // TODO: Handle no song case
      return;
    }

    await audio.loadSong(song);

    if (!initialized()) {
      api.song.subscribeToSongUpdate(song.id, (song) => {
        log.debug("The song has been updated!");
        audio.loadSong(song);
      });
      api.chat.subscribe((chat() as Chat)?.chatId, (chat) => {
        log.debug("The chat has been updated!");
        setChat(chat)
      })
      api.group.subscribe((group() as Group).id, (group) => {
        log.debug("The group has been updated!");
        groupActions.mutate(group);
      });
      setInitialized(true);
    }
  });


  function handleModalClose() {
    setInitErr(null);
  }

  async function handlePassTurn(nextUser: User) {
    await api.song.update(
      audio.store,
      nextUser.id,
      (group() as Group).id
    );
  }

  return (
    <>
      <MenuButton />
      <div class="TurnModePage page">
        <Show when={initErr()}>
          <ErrorModal onClose={handleModalClose}>{initErr()}</ErrorModal>
        </Show>
        <Show
          when={initialized()}
          fallback={<Loader loading={!initialized()} />}
        >
          <div class="body">
            <Sequencer />
          </div>
          <div class="group">
            <GroupMenu
              userId={appState.user?.id}
              activeUserId={group()?.turnMode?.activeUserId}
              users={group()?.users || []}
              onPassTurn={handlePassTurn}
            />
          </div>
          <ChatRoom chat={chat() as Chat} />
        </Show>
      </div>
    </>
  );
}
