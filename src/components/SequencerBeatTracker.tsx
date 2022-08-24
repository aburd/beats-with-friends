import {For} from 'solid-js'
import {TimeSignature} from "../audio";
import "./SequencerBeatTracker.css";

interface Props {
  cur16th?: number;
  timeSignature?: TimeSignature;
}

export default function SequencerBeatTracker(props: Props) {
  const [top, bottom] = props.timeSignature || [4, 4];

  return (
    <div class="SequencerBeatTracker">
      <For each={Array(top * bottom).fill(null)}>
        {(_, i) => (
          <div class="tracker-light-container">
            <div class={`tracker-light ${i() === props.cur16th ? `on` : undefined}`} />
          </div>
        )}
      </For>
    </div>
  );
}
