import {For, createSignal, createEffect} from "solid-js";
import audio, {sequences} from "../audio";
import SequencerTrack from "./SequencerTrack";
import SequencerBeatTracker from "./SequencerBeatTracker";

type Props = {
  sequences: sequences.Sequence[];
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
      <For each={sequences}>
        {({id, pattern}) => (
          <SequencerTrack
            id={id}
            initialSequence={pattern}
            timeSignature={[4, 4]}
            onBtnClick={onSequenceBtnClick}
          />
        )}
      </For>
    </div>
  );
}
