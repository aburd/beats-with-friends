import {Show, onMount, onCleanup, createSignal, createResource, useContext} from "solid-js";
import log from "loglevel";
import {AppContextContext} from "../AppContextProvider";
import Sequencer from "../components/Sequencer";
import Loader from "../components/Loader";
import ErrorModal from "../components/ErrorModal";
import * as api from "../api";
import audio, {Song, TimeSignature} from "../audio";
import {TurnModeState} from "../types";
import "./TurnModePage.css";

// Somehow we know the usersId and the groupId
const userId = '1';
const groupId = '1';

type TurnModePageProps = {};

export default function TurnModePage(props: TurnModePageProps) {
  const [initializing, setInitializing] = createSignal(true);
  const [turnModeState, setTurnMode] = createSignal<TurnModeState | null>(null);
  const [song, setSong] = createSignal<Song | null>(null);
  const [initErr, setInitErr] = createSignal<string | null>(null);
  const [appState] = useContext(AppContextContext);

  log.trace(appState);

  onMount(async () => {
    try {
      // This probably should be retrieved in the bootstrap process somehow
      // Maybe just use Firebase for this
      const user = await api.user.get(userId);
      const turnModeState = await api.group.getTurnMode(groupId);
      setTurnMode(turnModeState);
      const song = await api.song.get(turnModeState.songId);
      setSong(song);

      // Hooray patterns, lets add them to our audio context
      await audio.importSongToAudioStore(song);
      audio.setStore({
        timeSignature: song.timeSignature as TimeSignature,
        curPattern: song.patterns[0].id as string,
        songName: song.name,
      });
    } catch (e) {
      log.error(e);
      setInitErr('There was an error loading turn mode');
    } finally {
      setInitializing(false);
    }
  });

  function handleModalClose() {
    setInitErr(null);
  }

  return (
    <div class="TurnModePage page">
      <Show when={initErr()}>
        <ErrorModal onClose={handleModalClose}>{initErr()}</ErrorModal>
      </Show>
      <div class="title">
        Turn Mode
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
  );
}
