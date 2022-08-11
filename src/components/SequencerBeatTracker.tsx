import {useRef, createEffect} from 'react'
import * as audio from "@/audio";
import "./SequencerBeatTracker.css";

function handleSixteenthChange(cur16th: number) {
  cur16th = (cur16th + 1) % 16;
  const lastLightIdx = (cur16th - 1 + 16) % 16;
  const lightEls = document.querySelectorAll('.tracker-light')
  lightEls[lastLightIdx].classList.remove('on');
  lightEls[cur16th].classList.add('on');
}

function handleStop() {
  const lightEls = document.querySelectorAll('.tracker-light.on');
  for (const lightEl of lightEls) {
    lightEl.classList.remove('on');
  }
}

interface Props {
  timeSignature?: audio.TimeSignature;
}

export default function SequencerBeatTracker({
  timeSignature = [4, 4],
}: Props) {
  const [top, bottom] = timeSignature;

  createEffect(() => {
    audio.subscribe('sixteenthTick', handleSixteenthChange)
    audio.subscribe('stop', handleStop);
    return () => {
      audio.unsubscribe('sixteenthTick', handleSixteenthChange)
    }
  }, []);

  return (
    <div class="SequencerBeatTracker">
      {Array(top * bottom)
        .fill(null)
        .map((_, i) => {
          return (
            <div class="tracker-light-container" key={`light-${i}`}>
              <div class={`tracker-light`} />
            </div>
          );
        })}
    </div>
  );
}
