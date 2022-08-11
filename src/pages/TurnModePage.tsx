import {createEffect, createSignal} from "solid-js";
import Sequencer from "@/components/Sequencer";
import api from "@/api";
// import createGlobalDOMEvents from "@/hooks/createGlobalDOMEvents";
import * as audio from "@/audio";

type TurnModePageProps = {};

let setP = false;

function registerSequences(song: audio.Song, timeSignature: audio.TimeSignature) {
  for (const [patternId, pattern] of Object.entries(song.patterns)) {
    for (const bar of pattern.bars) {
      const seq = audio.util.barToSequence(timeSignature, bar)
      audio.registerSequence(seq)
    }
  }
}

export default function TurnModePage(props: TurnModePageProps) {
  const [song, setSong] = createSignal<audio.Song | null>(null);
  const [bpm, setBpm] = createSignal<number>(120);
  const [patternId, setPatternId] = createSignal<string | number>("1");
  const [timeSignature, setTimeSignature] = createSignal<audio.TimeSignature>([
    4, 4,
  ]);

  createEffect(() => {
    audio.init();
    api.song.get("dummy-id").then((song) => {
      setSong(song);
      if (!setP) {
        registerSequences(song, timeSignature())
        setP = true;
      }
    });
    return () => {
      audio.cleanup();
    }
  }, []);

  createEffect(() => {
    audio.setBpm(bpm());
  }, [bpm])

  function handlePlayClick() {
    if (audio.state() === "started") {
      audio.pacreate();
      return;
    }
    audio.play();
  }

  createGlobalDOMEvents({
    keyup: function (ev) {
      const {key} = ev as KeyboardEvent;
      if (key === " ") {
        handlePlayClick();
      }
    }
  });

  function handleBpmChange(newBpm: number) {
    if (newBpm > 0) {
      setBpm(newBpm);
    }
  }

  function handleSequenceChange(id: string, sixteenth: number, on: boolean) {
    console.log({id, sixteenth, on})
    audio.updateSequence(id, sixteenth, on)
  }

  const initialSequence = song
    ? audio.util.barToSequence(timeSignature, song.patterns[patternId].bars[0])
    : null;
  const clapSequence = song
    ? audio.util.barToSequence(timeSignature, song.patterns['2'].bars[0])
    : null;

  return (
    <div className="TurnModePage">
      <h1>Turn Mode</h1>
      <div>{song?.name}</div>
      <div>Pattern: {patternId}</div>
      <div>
        <label htmlFor="bpm">BPM</label>
        <input type="number" value={bpm} onChange={(e) => handleBpmChange(Number(e.target.value))} />
      </div>
      {initialSequence && clapSequence && (
        <Sequencer
          sequences={[initialSequence, clapSequence]}
          onPlayClick={handlePlayClick}
          onStopClick={audio.stop}
          onSequenceBtnClick={handleSequenceChange}
        />
      )}
    </div>
  );
}
