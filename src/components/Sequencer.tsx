import {For, createSignal, createEffect} from "solid-js";
import SequencerTrack from "./SequencerTrack";
import SequencerBeatTracker from "./SequencerBeatTracker";
import audio from "../audio";
import {ClientTrack} from "../audio/tracks";

type Props = {
  initialTracks: ClientTrack[];
  onPlayClick: () => void;
  onStopClick: () => void;
  onInit?: () => void;
  onSequenceBtnClick: (id: string, sixteenth: number, on: boolean) => void;
};

export default function Sequencer({
  initialTracks,
  onPlayClick,
  onStopClick,
  onInit = () => {},
  onSequenceBtnClick,
}: Props) {
  console.log('tracks', tracks);
  const playing = audio.state() === "started";

  createEffect(() => {
    onInit();
  }, []);

  return (
    <div class="Sequencer">
      <SequencerBeatTracker />
      <button onClick={onPlayClick}>{playing ? "Pause" : "Play"}</button>
      <button onClick={onStopClick}>Stop</button>
      <For each={tracks}>
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
