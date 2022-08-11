import {For, createSignal, createEffect} from "solid-js";
import SequencerTrack from "./SequencerTrack";
import SequencerBeatTracker from "./SequencerBeatTracker";
import audio from "../audio";

type Props = {
  onPlayClick: () => void;
  onStopClick: () => void;
  onSequenceBtnClick: (id: string, sixteenth: number, on: boolean) => void;
};

export default function Sequencer({
  onPlayClick,
  onStopClick,
  onSequenceBtnClick,
}: Props) {
  return (
    <div class="Sequencer">
      <SequencerBeatTracker />
      <button onClick={onPlayClick}>{audio.audioStore.playState === "started" ? "Pause" : "Play"}</button>
      <button onClick={onStopClick}>Stop</button>
      <For each={Object.values(audio.audioStore.trackMap)}>
        {({id, sequence}) => (
          <SequencerTrack
            id={id}
            initialSequence={sequence}
            timeSignature={[4, 4]}
            onBtnClick={onSequenceBtnClick}
          />
        )}
      </For>
    </div>
  );
}
