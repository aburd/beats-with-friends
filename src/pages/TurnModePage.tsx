import {Show, onMount, onCleanup, createEffect, createSignal, createResource} from "solid-js";
import Sequencer from "../components/Sequencer";
import api from "../api";
import audio, {Song, TimeSignature} from "../audio";

type TurnModePageProps = {};

export default function TurnModePage(props: TurnModePageProps) {
  const [songData, {mutate, refetch}] = createResource<Song | null>(() => api.song.get('placeholder'));

  createEffect(() => {
    if (!songData.loading) {
      console.log(songData());
      // Hooray patterns, lets add them to our audio context
      audio.importSongToAudioStore(songData() as Song);
      audio.setStore({ timeSignature: songData()?.timeSignature as TimeSignature });
      audio.setStore({ curPattern: songData()?.patterns[0].id as string });
    }
  });

  return (
    <div class="TurnModePage">
      <h1>Turn Mode</h1>
      <Show when={!songData.loading} fallback={<div>Loading song...</div>}>
        <div>{songData()?.name}</div>
        <div>
          <Sequencer />
        </div>
      </Show>
    </div>
  );
}
