import { useMemo, useState, useEffect } from "react";
import BeatButton from "./BeatButton";
import { TimeSignature } from '@/audio';
import "./SequencerTrack.css";

type Sequence = boolean[];

interface Props {
  initialSequence: Sequence;
  id: string;
  timeSignature?: TimeSignature;
  onBtnClick: (id: string, sixteenth: number, on: boolean) => void;
}

export default function SequencerTrack({
  id,
  initialSequence,
  timeSignature = [4, 4],
  onBtnClick = () => {},
}: Props) {
  const [top, bottom] = timeSignature;

  const btns = useMemo(() => {
    const btnColors = ["red", "orange", "yellow", "white"];
    return Array(top * bottom)
      .fill(null)
      .map((v, i) => {
        const active = initialSequence[i];
        const bgColor = btnColors[Math.floor(i / top)] || "white";
        return { active, bgColor };
      });
  }, [timeSignature]);

  return (
    <div className="SequencerTrack" data-id={id}>
      {btns.map(({ active, bgColor }, i) => (
        <div className="btn-container" key={`beat-btn-${i}`}>
          <span className="btn-label">{i + 1}</span>
          <BeatButton
            initialActive={active}
            bgColor={bgColor}
            onClick={(active) => {
              onBtnClick(id, i, active);
            }}
          />
        </div>
      ))}
    </div>
  );
}
