import {Show, onMount, onCleanup, createEffect, createSignal, createResource} from "solid-js";
import Sequencer from "../components/Sequencer";
import api from "../api";
import audio, {Song, TimeSignature} from "../audio";

type TurnModePageProps = {};

export default function TurnModePage(props: TurnModePageProps) {
  const [songData, {mutate, refetch}] = createResource<Song | null>(() => api.song.get('placeholder'));

  onMount(() => {
    audio.init();
    window.addEventListener("keyup", function(e) {
      if (e.key === " ") {
        handlePlayClick(); 
      }
    });
  });
  onCleanup(() => audio.cleanup());

  createEffect(() => {
    if (!songData.loading) {
      console.log(songData());
      // Hooray patterns, lets add them to our audio context
      audio.importSongToAudioStore(songData() as Song);
      audio.setStore({ timeSignature: songData()?.timeSignature as TimeSignature });
      audio.setStore({ curPattern: songData()?.patterns[0].id as string });
    }
  });

  function handleBpmChange(newBpm: number) {
    if (newBpm > 0) {
      audio.setStore({ bpm: newBpm });
    }
  }

  function handleSequenceChange(id: string, sixteenth: number, on: boolean) {
    console.log({id, sixteenth, on})
  }

  function handlePlayClick() {
    if (audio.audioStore.playState === "started") {
      audio.pause();
      return;
    }
    audio.play();
  }

  function handleStopClick() {
    audio.stop();
  }

  return (
    <div class="TurnModePage">
      <h1>Turn Mode</h1>
      <Show when={!songData.loading} fallback={<div>Loading song...</div>}>
        <div>{songData()?.name}</div>
        <div>Pattern: {audio.audioStore.curPattern}</div>
        <div>
          <label for="bpm">BPM</label>
          <input type="number" value={audio.audioStore.bpm} onInput={(e) => handleBpmChange(Number(e.currentTarget.value))} />
        </div>
        <div>
          <Sequencer
            onPlayClick={handlePlayClick}
            onStopClick={handleStopClick}
            onSequenceBtnClick={handleSequenceChange}
          />
        </div>
      </Show>
    </div>
  );
}
