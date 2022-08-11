import {Show, createEffect, createSignal, createResource} from "solid-js";
import Sequencer from "@/components/Sequencer";
import api from "@/api";
// import createGlobalDOMEvents from "@/hooks/createGlobalDOMEvents";
import audio, {Song, TimeSignature} from "@/audio";

type TurnModePageProps = {};

export default function TurnModePage(props: TurnModePageProps) {
  const [songData, {mutate, refetch}] = createResource<Song | null>(() => api.song.get('placeholder'));
  const [bpm, setBpm] = createSignal<number>(120);
  const [patternId, setPatternId] = createSignal<string | number>("1");
  const [timeSignature, setTimeSignature] = createSignal<TimeSignature>([
    4, 4,
  ]);

  function handleBpmChange(newBpm: number) {
    if (newBpm > 0) {
      setBpm(newBpm);
    }
  }

  function handleSequenceChange(id: string, sixteenth: number, on: boolean) {
    console.log({id, sixteenth, on})
  }

  return (
    <div class="TurnModePage">
      <h1>Turn Mode</h1>
      <Show when={!songData.loading} fallback={<div>Loading song...</div>}>
        <div>{songData()?.name}</div>
        <div>Pattern: {patternId}</div>
        <div>
          <label for="bpm">BPM</label>
          <input type="number" value={bpm()} onInput={(e) => handleBpmChange(Number(e.currentTarget.value))} />
        </div>
        <Sequencer
          sequences={[]}
          onPlayClick={() => {}}
          onStopClick={() => {}}
          onSequenceBtnClick={() => {}}
        />
      </Show>
    </div>
  );
}
