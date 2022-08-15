import {Show, onMount, onCleanup, createSignal, createResource, useContext, createEffect} from "solid-js";
import log from "loglevel";
import {useParams} from "@solidjs/router";
import {AppContextContext} from "../AppContextProvider";
import Sequencer from "../components/Sequencer";
import Loader from "../components/Loader";
import MenuButton from "../components/MenuButton";
import ErrorModal from "../components/ErrorModal";
import * as api from "../api";
import audio, {Song, TimeSignature} from "../audio";
import {Group, TurnModeState} from "../types";
import "./TurnModePage.css";

type TurnModePageProps = {};

export default function TurnModePage(props: TurnModePageProps) {
  const params = useParams();
  const [initializing, setInitializing] = createSignal(true);
  const [turnModeState, setTurnMode] = createSignal<TurnModeState | null>(null);
  const [group, groupActions] = createResource<Group | null>(() => api.group.get(params.groupId));
  const [song, setSong] = createSignal<Song | null>(null);
  const [subscribedToSong, setSubscribedToSong] = createSignal<boolean>(false);
  const [ownTurn, setOwnTurn] = createSignal<boolean>(false);
  const [initErr, setInitErr] = createSignal<string | null>(null);
  const [appState] = useContext(AppContextContext);

  log.debug(appState);

  createEffect(() => {
    if (!group()?.turnMode) return;

    // @ts-ignore
    setOwnTurn(group().turnMode?.activeUserId === appState?.fbUser.uid);
  })

  async function fetchSong(group: Group): Promise<Song | null> {
    log.debug({group});
    if (!group?.turnMode) return null;

    try {
      // This probably should be retrieved in the bootstrap process somehow
      // Maybe just use Firebase for this
      const song = await api.song.get(group.turnMode?.songId);
      log.debug({song})
      if (!song) throw Error("No song in database");

      // Hooray patterns, lets add them to our audio context
      await audio.importSongToAudioStore(song);
      audio.setStore({
        timeSignature: song.timeSignature as TimeSignature,
        curPattern: song.patterns[0].id as string,
        songName: song.name,
      });

      return song;
    } catch (e) {
      log.error(e);
      setInitErr('There was an error loading turn mode');
      throw e;
    } finally {
      setInitializing(false);
    }
  }

  createEffect(async () => {
    const song = await fetchSong(group() as Group);
    setSong(song);
  });

  createEffect(() => {
    if (!song()) return;
    if (!subscribedToSong()) {
      api.song.subscribeToSongUpdate((song() as Song).id, (song) => {
        log.debug("The song has been updated!");
        setSong(song);
      });
      setSubscribedToSong(true);
    }
  });

  function handleModalClose() {
    setInitErr(null);
  }

  function handleSequenceChange(patternId: string, trackId: string, sequenceId: string, sixteenth: number, on: boolean) {
    log.warn('Not implemented!')
  }

  async function handlePassTurn() {
    if (!group()) throw Error('Need a group to pass turn.');

    const nextUsers = (group() as Group).users?.filter(u => u.id !== appState?.user?.id)
    if (!nextUsers.length) throw Error('No next user to pass to!');

    const nextUserId = nextUsers[0].id;
    log.debug("Song", song());
    await api.song.update(audio.audioStore, (song() as Song).id, nextUserId, (group() as Group).id);

    await groupActions.refetch();
  }

  return (
    <>
      <MenuButton />
      <div class="TurnModePage page">
        <Show when={initErr()}>
          <ErrorModal onClose={handleModalClose}>{initErr()}</ErrorModal>
        </Show>
        <div class="title">
          {ownTurn() ? "It's your turn!" : `It's ${group()?.users.find(u => u.id === group()?.turnMode?.activeUserId)?.name}'s turn!`}
          <Show when={ownTurn()}>
            <button class="warning" onClick={handlePassTurn}>Pass Turn</button>
          </Show>
        </div>
        <div class="body">
          <Show
            when={!initializing()}
            fallback={<Loader loading={initializing()} />}
          >
            <Sequencer />
          </Show>
        </div>
      </div>
    </>
  );
}
