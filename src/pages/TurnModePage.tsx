import {
  Show,
  onMount,
  onCleanup,
  createSignal,
  createResource,
  useContext,
  createEffect,
} from "solid-js";
import log from "loglevel";
import { useParams } from "@solidjs/router";
import { AppContextContext } from "../AppContextProvider";
import Sequencer from "../components/Sequencer";
import Loader from "../components/Loader";
import MenuButton from "../components/MenuButton";
import ErrorModal from "../components/ErrorModal";
import TurnDisplay from "../components/TurnDisplay";
import * as api from "../api";
import audio, { Song, TimeSignature } from "../audio";
import { User, Group, TurnModeState } from "../types";
import "./TurnModePage.css";

export default function TurnModePage() {
  const params = useParams();
  const [initializing, setInitializing] = createSignal(true);
  const [turnModeDisplayed, setTurnModeDisplayed] = createSignal(false);
  const [turnModeState, setTurnMode] = createSignal<TurnModeState | null>(null);
  const [group, groupActions] = createResource<Group | null>(() =>
    api.group.get(params.groupId)
  );
  const [song, setSong] = createSignal<Song | null>(null);
  const [subscribedToSong, setSubscribedToSong] = createSignal<boolean>(false);
  const [ownTurn, setOwnTurn] = createSignal<boolean>(false);
  const [initErr, setInitErr] = createSignal<string | null>(null);
  const [appState] = useContext(AppContextContext);

  log.debug(appState);

  createEffect(() => {
    if (!group()?.turnMode) return;

    setOwnTurn(
      (group() as Group).turnMode?.activeUserId === appState?.fbUser?.uid
    );
  });

  async function fetchSong(group: Group): Promise<Song | null> {
    log.debug({ group });
    if (!group?.turnMode) return null;

    try {
      // This probably should be retrieved in the bootstrap process somehow
      // Maybe just use Firebase for this
      const song = await api.song.get(group.turnMode?.songId);
      log.debug({ song });
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
      setInitErr("There was an error loading turn mode");
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
    if (!group()) return;
    if (!subscribedToSong()) {
      api.song.subscribeToSongUpdate((song() as Song).id, (song) => {
        log.debug("The song has been updated!");
        setSong(song);
      });
      api.group.subscribe((group() as Group).id, (group) => {
        log.debug("The group has been updated!");
        groupActions.mutate(group);
      });
      setSubscribedToSong(true);
    }
  });

  function handleModalClose() {
    setInitErr(null);
  }

  function handleSequenceChange(
    patternId: string,
    trackId: string,
    sequenceId: string,
    sixteenth: number,
    on: boolean
  ) {
    log.warn("Not implemented!");
  }

  async function handlePassTurn(nextUser: User) {
    await api.song.update(
      audio.audioStore,
      (song() as Song).id,
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
        <div class="title">
          <div class="title-right">{group()?.name}</div>
        </div>
        <div class="body">
          <Show
            when={!initializing()}
            fallback={<Loader loading={initializing()} />}
          >
            <Sequencer />
          </Show>
          <Show
            when={turnModeDisplayed()}
            fallback={
              <button onClick={() => setTurnModeDisplayed(true)}>
                Turn Mode
              </button>
            }
          >
            <TurnDisplay
              userId={appState.user?.id}
              activeUserId={group()?.turnMode?.activeUserId}
              users={group()?.users || []}
              onPassTurn={handlePassTurn}
              onCloseDisplay={() => setTurnModeDisplayed(false)}
            />
          </Show>
        </div>
      </div>
    </>
  );
}
