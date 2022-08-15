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

// Somehow we know the usersId and the groupId
const userId = '1';
const groupId = '1';

type TurnModePageProps = {};

export default function TurnModePage(props: TurnModePageProps) {
  const params = useParams();
  const [initializing, setInitializing] = createSignal(true);
  const [turnModeState, setTurnMode] = createSignal<TurnModeState | null>(null);
  const [group, groupActions] = createResource<Group | null>(() => api.group.get(params.groupId));
  const [song, setSong] = createSignal<Song | null>(null);
  const [initErr, setInitErr] = createSignal<string | null>(null);
  const [appState] = useContext(AppContextContext);

  log.debug(appState);

  async function fetchSong(group: Group): Promise<Song> {
    log.debug({group});
    if (!group.turnMode?.songId) throw Error('No song id');

    try {
      // This probably should be retrieved in the bootstrap process somehow
      // Maybe just use Firebase for this
      const song = await api.song.get(group.turnMode?.songId);
      log.debug({ song })
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

  createEffect(() => {
    fetchSong(group() as Group);
  })

  function handleModalClose() {
    setInitErr(null);
  }

  return (
   <> 
      <MenuButton />
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
    </>
  );
}
