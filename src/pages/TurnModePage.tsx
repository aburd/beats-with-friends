import { useEffect, useState } from "react";
import Sequencer from "@/components/Sequencer";
import api from "@/api";
import * as util from "@/util";
import * as audio from "@/audio";

type TurnModePageProps = {};

export default function TurnModePage(props: TurnModePageProps) {
  const [song, setSong] = useState<audio.Song | null>(null);
  const [patternId, setPatternId] = useState<string | number>("1");
  const [timeSignature, setTimeSignature] = useState<audio.TimeSignature>([
    4, 4,
  ]);

  useEffect(() => {
    api.song.get("dummy-id").then((song) => {
      setSong(song);
    });
  }, []);

  function handlePlayClick() {
    if (audio.state() === "playing") {
      audio.pause();
      return;
    }
    if (song) {
      audio.setPattern(song.patterns[patternId].bars[0]);
      audio.play();
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
