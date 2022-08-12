import {Show, onMount, onCleanup, createEffect, createSignal, createResource} from "solid-js";
import Sequencer from "../components/Sequencer";
import Loader from "../components/Loader";
import api from "../api";
import audio, {Song, TimeSignature} from "../audio";
import "./TurnModePage.css";

type TurnModePageProps = {};

export default function TurnModePage(props: TurnModePageProps) {
  const [songData, {mutate, refetch}] = createResource<Song | null>(() => api.song.get('placeholder'));
  const [initializing, setInitializing] = createSignal(true);

  createEffect(async () => {
    if (!songData.loading) {
      // Hooray patterns, lets add them to our audio context
      await audio.importSongToAudioStore(songData() as Song);
      audio.setStore({
        timeSignature: songData()?.timeSignature as TimeSignature,
        curPattern: songData()?.patterns[0].id as string,
        songName: songData()?.name,
      });
      setInitializing(false);
    }
  });

  return (
    <div class="TurnModePage page">
      <div class="title">
        Turn Mode
      </div>
      <div class="body">
        <Show when={!(initializing())} fallback={<Loader loading={initializing()} error={String(songData.error)} />}>
          <Sequencer />
        </Show>
      </div>
    </div>
  );
}
