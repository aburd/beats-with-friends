import { useState, useEffect } from "react";
import * as audio from "../audio";
import SequencerBar from "./SequencerBar";

export type Sequence = {
  id: string | number;
  initialSequence: boolean[];
};

type Props = {
  sequences: Sequence[];
  onPlayClick: () => void;
  onStopClick: () => void;
  onInit?: () => void;
  onSequenceChange: (id: string | number, sequence: boolean[]) => void;
};

export default function Sequencer({
  sequences,
  onPlayClick,
  onStopClick,
  onInit = () => {},
  onSequenceChange,
}: Props) {
  const playing = audio.state() === "playing";

  useEffect(() => {
    onInit();
  }, []);

  return (
    <div className="Sequencer">
      <button onClick={onPlayClick}>{playing ? "Pause" : "Play"}</button>
      <button onClick={onStopClick}>Stop</button>
      {sequences.map(({ id, initialSequence }) => (
        <SequencerBar
          key={`sequencer-bar-${id}`}
          initialSequence={initialSequence}
          timeSignature={[4, 4]}
          onSequenceChange={(sequence) => {
            onSequenceChange("instrument", sequence);
          }}
        />
      ))}
    </div>
  );
}
