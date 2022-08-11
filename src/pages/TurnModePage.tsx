import {createEffect, createSignal} from "solid-js";
// import Sequencer from "@/components/Sequencer";
import api from "@/api";
// import createGlobalDOMEvents from "@/hooks/createGlobalDOMEvents";
import audio, { Song, TimeSignature } from "@/audio";

type TurnModePageProps = {};

export default function TurnModePage(props: TurnModePageProps) {
  const [song, setSong] = createSignal<Song | null>(null);
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
      <div>{song?.name}</div>
      <div>Pattern: {patternId}</div>
      <div>
        <label for="bpm">BPM</label>
        <input type="number" value={bpm()} onInput={(e) => handleBpmChange(Number(e.currentTarget.value))} />
      </div>
    </div>
  );
}
