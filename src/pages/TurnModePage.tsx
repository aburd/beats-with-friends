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

  function fetchSong() {
    api.song.get("dummy-id").then((song) => {
      setSong(song);
    });
  }

  useEffect(() => {
    fetchSong();
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

  function handleSequenceChange(id: any, sequence: any) {
    console.log({ id, sequence });
  }

  const initialSequence = song
    ? util.barToSequence(timeSignature, song.patterns[patternId].bars[0])
    : null;

  return (
    <div className="TurnModePage">
      <h1>Turn Mode</h1>
      <div className="card">{song?.name}</div>
      <div className="card">Pattern: {patternId}</div>
      {initialSequence && (
        <Sequencer
          sequences={[initialSequence]}
          onPlayClick={handlePlayClick}
          onStopClick={audio.stop}
          onSequenceChange={handleSequenceChange}
        />
      )}
    </div>
  );
}

