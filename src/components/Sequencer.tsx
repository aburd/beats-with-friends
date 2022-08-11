import {For, onMount, onCleanup, createSignal, createEffect} from "solid-js";
import SequencerTrack from "./SequencerTrack";
import SequencerBeatTracker from "./SequencerBeatTracker";
import audio from "../audio";
import "./Sequencer.css"

type SequencerProps = {};

export default function Sequencer({}: SequencerProps) {
  onMount(() => {
    audio.init();
    window.addEventListener("keyup", function (e) {
      if (e.key === " ") {
        handlePlayClick();
      }
    });
  });

  onCleanup(() => audio.cleanup());

  function handleBpmChange(newBpm: number) {
    if (newBpm > 0) {
      audio.setStore({bpm: newBpm});
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

  function handlePatternSelect(id: string) {
    audio.setStore({curPattern: id});
  }

  return (
    <div class="Sequencer">
      <section class="Sequencer-info">
        <div class="Sequencer-window">
          <span>SONG</span>
          <div>{audio.audioStore.songName}</div>
        </div>
        <div class="Sequencer-window">
          <span>PATTERN</span>{}
          <select value={audio.audioStore.curPattern || undefined} onSelect={(e) => handlePatternSelect(e.currentTarget.value)}>
            <For each={Object.entries(audio.audioStore.patternMap)}>
              {([id, pat]) => (
                <option value={id}>{pat.name}</option>
              )}
            </For>
          </select>
        </div>
        <div class="Sequencer-window">
          <span>BPM</span>
          <input type="number" value={audio.audioStore.bpm} onInput={(e) => handleBpmChange(Number(e.currentTarget.value))} />
        </div>
      </section>
      <section class="Sequencer-tracks">
        <SequencerBeatTracker />
        <For each={Object.values(audio.audioStore.trackMap)}>
          {({id, sequence}) => (
            <SequencerTrack
              id={id}
              initialSequence={sequence}
              timeSignature={[4, 4]}
              onBtnClick={handleSequenceChange}
            />
          )}
        </For>
      </section>
      <section class="Sequencer-controls">
        <button onClick={handlePlayClick}>{audio.audioStore.playState === "started" ? "Pause" : "Play"}</button>
        <button onClick={handleStopClick}>Stop</button>
      </section>
    </div>
  );
}
