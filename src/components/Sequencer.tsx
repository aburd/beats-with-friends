import {
  For,
  onMount,
  onCleanup,
} from "solid-js";
import log from "loglevel";
import SequencerTrack from "./SequencerTrack";
import SequencerBeatTracker from "./SequencerBeatTracker";
import audio from "../audio";
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
    if (audio.audioStore.playState === "started") {
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
    audio.setStore({ curPattern: id });
  }

  return (
    <div class="Sequencer">
      <section class="Sequencer-info">
        <div class="Sequencer-window">
          <span>SONG</span>
          <div>{audio.audioStore.songName || "NO SONG LOADED"}</div>
        </div>
        <div class="Sequencer-window">
          <span>PATTERN</span>
          {}
          <select
            value={audio.audioStore.curPattern || undefined}
            onSelect={(e) => handlePatternSelect(e.currentTarget.value)}
          >
            <For each={Object.entries(audio.audioStore.patternMap)}>
              {([id, pat]) => <option value={id}>{pat.name}</option>}
            </For>
          </select>
        </div>
        <div class="Sequencer-window">
          <span>BPM</span>
          <input
            type="number"
            value={audio.audioStore.bpm}
            onInput={(e) => handleBpmChange(Number(e.currentTarget.value))}
          />
        </div>
      </section>
      <section class="Sequencer-tracks">
        <SequencerBeatTracker
          timeSignature={audio.audioStore.timeSignature || undefined}
          cur16th={audio.audioStore.cur16th}
        />
        <For each={Object.values(audio.audioStore.trackMap)}>
          {(item) => (
            <>
              <div style={{ "text-align": "center" }}>
                {audio.audioStore.instrumentMap[item.instrumentId].name}
              </div>
              <SequencerTrack
                id={item.id}
                initialSequence={item.sequence}
                timeSignature={audio.audioStore.timeSignature || [4, 4]}
                onBtnClick={handleSequenceChange}
              />
            </>
          )}
        </For>
      </section>
      <section class="Sequencer-controls">
        <button onClick={handlePlayClick}>
          {audio.audioStore.playState === "started" ? "Pause" : "Play"}
        </button>
        <button onClick={handleStopClick}>Stop</button>
      </section>
    </div>
  );
}
