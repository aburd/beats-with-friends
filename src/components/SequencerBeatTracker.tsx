import {For, createSignal, onMount, onCleanup} from 'solid-js'
import audio, {TimeSignature} from "@/audio";
import "./SequencerBeatTracker.css";

interface Props {
  timeSignature?: TimeSignature;
}

export default function SequencerBeatTracker({
  timeSignature = [4, 4],
}: Props) {
  const [top, bottom] = timeSignature;
  const [currentOn, setCurrentOn] = createSignal(-1);

  function handleSixteenthChange(cur16th: number) {
    setCurrentOn(cur16th);
  }

  function handleStop() {
    setCurrentOn(-1);
  }

  onMount(() => {
    audio.subscribe('sixteenthTick', handleSixteenthChange)
    audio.subscribe('stop', handleStop);
  });
  onCleanup(() => {
    audio.unsubscribe('sixteenthTick', handleSixteenthChange)
  });

  return (
    <div class="SequencerBeatTracker">
      <For each={Array(top * bottom).fill(null)}>
        {(_, i) => (
          <div class="tracker-light-container">
            <div class={`tracker-light ${i === currentOn ? `on` : undefined}`} />
          </div>
        )}
      </For>
    </div>
  );
}
