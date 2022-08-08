import {useMemo, useState, useEffect} from 'react'
import BeatButton from './BeatButton'
import './SequencerBar.css'

type Sequence = boolean[];

interface Props {
  initialSequence: Sequence;
  timeSignature?: [number, number]; // [ top, buttom ]
  onSequenceChange?: (sequence: Sequence) => void,
}

export default function SequencerBar({
  initialSequence,
  timeSignature = [4, 4],
  onSequenceChange = () => {},
}: Props) {
  const [top, bottom] = timeSignature;
  const [sequence, setSequence] = useState(initialSequence.slice(0, top*bottom));

  useEffect(() => {
    onSequenceChange(sequence);
  }, [sequence]);

  const btns = useMemo(() => {
    const btnColors = ['red', 'orange', 'yellow', 'white'];
    return Array(top * bottom).fill(null).map((v, i) => {
      const active = sequence[i];
      const bgColor = btnColors[Math.floor(i / top)] || 'white';
      return {active, bgColor}
    });
  }, [timeSignature]);

  return (
    <div className="SequencerBar">
      {btns.map(({active, bgColor}, i) => (
        <BeatButton
          key={`beat-btn-${i}`}
          initialActive={active}
          bgColor={bgColor}
          onClick={(active) => {
            const newSequence = [
              ...sequence.slice(0, i),
              active,
              ...sequence.slice(i + 1, sequence.length),
            ];
            setSequence(newSequence);
          }}
        />
      ))}
    </div>
  );
}
