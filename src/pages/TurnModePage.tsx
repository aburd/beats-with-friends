import { useEffect, useState } from "react";
import Sequencer from "@/components/Sequencer";
import api from "@/api";
import * as util from "@/util";
import * as audio from "@/audio";

type TurnModePageProps = {};

export default function TurnModePage(props: TurnModePageProps) {
  const [song, setSong] = useState<audio.Song | null>(null);
  const [bpm, setBpm] = useState<number>(120);
  const [patternId, setPatternId] = useState<string | number>("1");
  const [timeSignature, setTimeSignature] = useState<audio.TimeSignature>([
    4, 4,
  ]);

  useEffect(() => {
    api.song.get("dummy-id").then((song) => {
      setSong(song);
      audio.setPattern(song.patterns[patternId].bars[0]);
    });
  }, []);

  useEffect(() => {
    audio.setBpm(bpm);
  }, [bpm])

  function handlePlayClick() {
    if (audio.state() === "started") {
      audio.pause();
      return;
    }
    audio.play();
  }

  function handleBpmChange(newBpm: number) {
    if (newBpm > 0) {
      setBpm(newBpm);
    }
  }

  function handleSequenceChange(id: string, sixteenth: number, on: boolean) {
    console.log({ id, sixteenth, on });
  }

  const initialSequence = song
    ? util.barToSequence(timeSignature, song.patterns[patternId].bars[0])
    : null;

  return (
    <div className="TurnModePage">
      <h1>Turn Mode</h1>
      <div>{song?.name}</div>
      <div>Pattern: {patternId}</div>
      <div>
        <label htmlFor="bpm">BPM</label>
        <input type="number" value={bpm} onChange={(e) => handleBpmChange(e.target.value)} />
      </div>
      {initialSequence && (
        <Sequencer
          sequences={[initialSequence]}
          onPlayClick={handlePlayClick}
          onStopClick={audio.stop}
          onSequenceBtnClick={handleSequenceChange}
        />
      )}
    </div>
  );
}
