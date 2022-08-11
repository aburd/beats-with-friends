import { createSignal, createEffect, useRef } from "react";
import * as audio from "../audio";
import SequencerTrack from "./SequencerTrack";
import SequencerBeatTracker from "./SequencerBeatTracker";

type Props = {
  sequences: audio.Sequence[];
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

  createEffect(() => {
    onInit();
  }, []);

  return (
    <div class="Sequencer">
      <SequencerBeatTracker /> 
      <button onClick={onPlayClick}>{playing ? "Pause" : "Play"}</button>
      <button onClick={onStopClick}>Stop</button>
      {sequences.map(({ id, notes }) => (
        <SequencerTrack
          key={`sequencer-track-${id}`}
          id={id}
          initialSequence={notes}
          timeSignature={[4, 4]}
          onBtnClick={onSequenceBtnClick}
        />
      ))}
    </div>
  );
}
