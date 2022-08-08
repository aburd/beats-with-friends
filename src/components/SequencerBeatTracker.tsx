import {useRef, useEffect} from 'react'
import * as audio from "@/audio";
import "./SequencerBeatTracker.css";

function handleSixteenthChange(cur16th: number) {
  cur16th = (cur16th + 1) % 16;
  const lastLightIdx = (cur16th - 1 + 16) % 16;
  const lightEls = document.querySelectorAll('.tracker-light')
  lightEls[lastLightIdx].classList.remove('on');
  lightEls[cur16th].classList.add('on');
}

interface Props {
  timeSignature?: audio.TimeSignature;
}

export default function SequencerBeatTracker({
  timeSignature = [4, 4],
}: Props) {
  const [top, bottom] = timeSignature;

  useEffect(() => {
    audio.subscribe('sixteenthTick', handleSixteenthChange)
    return () => {
      audio.unsubscribe('sixteenthTick', handleSixteenthChange)
    }
  }, []);

  return (
    <div className="SequencerBeatTracker">
      {Array(top * bottom)
        .fill(null)
        .map((_, i) => {
          return (
            <div className="tracker-light-container" key={`light-${i}`}>
              <div className={`tracker-light`} />
            </div>
          );
        })}
    </div>
  );
}
