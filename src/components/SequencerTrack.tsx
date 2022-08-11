import {For, createMemo, createSignal, createEffect} from "solid-js";
import BeatButton from "./BeatButton";
import {TimeSignature} from '@/audio';
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

  const btns = createMemo(() => {
    const btnColors = ["red", "orange", "yellow", "white"];
    return Array(top * bottom)
      .fill(null)
      .map((v, i) => {
        const active = initialSequence[i];
        const bgColor = btnColors[Math.floor(i / top)] || "white";
        return {active, bgColor};
      });
  }, [timeSignature]);

  return (
    <div class="SequencerTrack" data-id={id}>
      <For each={btns()}>
        {({active, bgColor}, i) => (
          <div class="btn-container">
            <span class="btn-label">{i() + 1}</span>
            <BeatButton
              initialActive={active}
              bgColor={bgColor}
              onClick={(active) => {
                onBtnClick(id, i(), active);
              }}
            />
          </div>
        )}
      </For>
    </div>
  );
}
