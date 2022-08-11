import {Show, onMount, onCleanup, createEffect, createSignal, createResource} from "solid-js";
import Sequencer from "../components/Sequencer";
import api from "../api";
import audio, {Song, TimeSignature} from "../audio";
import "./TurnModePage.css";

type TurnModePageProps = {};

export default function TurnModePage(props: TurnModePageProps) {
  const [songData, {mutate, refetch}] = createResource<Song | null>(() => api.song.get('placeholder'));

  createEffect(() => {
    if (!songData.loading) {
      console.log(songData());
      // Hooray patterns, lets add them to our audio context
      audio.importSongToAudioStore(songData() as Song);
      audio.setStore({
        timeSignature: songData()?.timeSignature as TimeSignature,
        curPattern: songData()?.patterns[0].id as string,
        songName: songData()?.name,
      })
    }
  });

  return (
    <div class="TurnModePage page">
      <div class="title">
        Turn Mode
      </div>
      <div class="body">
        <Show when={!songData.loading} fallback={<div>Loading song...</div>}>
          <Sequencer />
        </Show>
      </div>
    </div>
  );
}
