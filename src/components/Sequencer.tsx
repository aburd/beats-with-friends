import { For, onMount, onCleanup } from "solid-js";
import log from "loglevel";
import { Sample } from "@/api/samples";
import SampleExplorer from "./SampleExplorer";
import SequencerTrack from "./SequencerTrack";
import SequencerBeatTracker from "./SequencerBeatTracker";
import audio from "../audio";
import * as api from "@/api";
import "./Sequencer.css";

export default function Sequencer() {
  onMount(() => {
    audio.init();
    window.addEventListener("keyup", function (e) {
      if (e.key === " ") {
        handlePlayClick();
      }
    });
  });

  onCleanup(() => {
    audio.stop();
    audio.cleanup();
  });

  function handleBpmChange(newBpm: number) {
    audio.setBpm(newBpm);
  }

  function handleSequenceChange(id: string, sixteenth: number, on: boolean) {
    log.debug({ id, sixteenth, on });
    audio.updateTrackSequence(id, sixteenth, on);
  }

  function handlePlayClick() {
    if (audio.store.playState === "started") {
      log.debug("Pausing");
      audio.pause();
      return;
    }
    log.debug("Playing");
    audio.play();
  }

  function handleStopClick() {
    log.debug("Stopping");
    audio.stop();
  }

  function handlePatternSelect(id: string) {
    audio.setCurPattern(id);
  }

  function handleSampleSelect(sample: Sample) {
    log.debug({ sample })
    api.song.addInstrument(audio.store.song.id, sample.path, sample.name as string);
  }

  return (
    <div class="Sequencer">
      <section class="Sequencer-info">
        <div class="Sequencer-window">
          <span>SONG</span>
          <div>{audio.store.song.name || "NO SONG LOADED"}</div>
        </div>
        <div class="Sequencer-window">
          <span>PATTERN</span>
          <select
            value={audio.store.curPattern || undefined}
            onSelect={(e) => handlePatternSelect(e.currentTarget.value)}
          >
            <For each={Object.entries(audio.store.patternMap)}>
              {([id, pat]) => <option value={id}>{pat.name}</option>}
            </For>
          </select>
        </div>
        <div class="Sequencer-window">
          <span>BPM</span>
          <input
            type="number"
            value={audio.store.song.bpm}
            min={1}
            onInput={(e) => handleBpmChange(Number(e.currentTarget.value))}
          />
        </div>
      </section>
      <section class="Sequencer-tracks">
        <SequencerBeatTracker
          timeSignature={audio.store.song.timeSignature || undefined}
          cur16th={audio.store.cur16th}
        />
        <SampleExplorer onSampleSelect={handleSampleSelect} />
        <For each={Object.values(audio.store.trackMap)}>
          {(item) => (
            <>
              <div style={{ "text-align": "center" }}>
                {audio.store.instrumentMap[item.instrumentId].name}
              </div>
              <SequencerTrack
                id={item.id}
                initialSequence={item.sequence}
                timeSignature={audio.store.song.timeSignature || [4, 4]}
                onBtnClick={handleSequenceChange}
              />
            </>
          )}
        </For>
      </section>
      <section class="Sequencer-controls">
        <button onClick={handlePlayClick}>
          {audio.store.playState === "started" ? "Pause" : "Play"}
        </button>
        <button onClick={handleStopClick}>Stop</button>
      </section>
    </div>
  );
}
