import { useState, useEffect, useRef } from "react";
import * as audio from "../audio";
import SequencerTrack from "./SequencerTrack";
import SequencerBeatTracker from "./SequencerBeatTracker";

export type Sequence = {
  id: string;
  initialSequence: boolean[];
};

type Props = {
  sequences: Sequence[];
  onPlayClick: () => void;
  onStopClick: () => void;
  onInit?: () => void;
  onSequenceBtnClick: (id: string, sixteenth: number, on: boolean) => void;
};

export default function Sequencer({
  sequences,
  onPlayClick,
  onStopClick,
  onInit = () => {},
  onSequenceBtnClick,
}: Props) {
  const playing = audio.state() === "playing";

  useEffect(() => {
    onInit();
  }, []);

  return (
    <div className="Sequencer">
      <SequencerBeatTracker /> 
      <button onClick={onPlayClick}>{playing ? "Pause" : "Play"}</button>
      <button onClick={onStopClick}>Stop</button>
      {sequences.map(({ id, initialSequence }) => (
        <SequencerTrack
          key={`sequencer-track-${id}`}
          id={id}
          initialSequence={initialSequence}
          timeSignature={[4, 4]}
          onBtnClick={onSequenceBtnClick}
        />
      ))}
    </div>
  );
}
