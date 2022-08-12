import {For, createMemo, createSignal, createEffect} from "solid-js";
import BeatButton from "./BeatButton";
import {TimeSignature} from '../audio';
import "./SequencerTrack.css";

type Sequence = boolean[];

interface Props {
  initialSequence: Sequence;
  id: string;
  timeSignature?: TimeSignature;
  onBtnClick: (id: string, sixteenth: number, on: boolean) => void;
}

export default function SequencerTrack(props: Props) {
  const [top, bottom] = props.timeSignature || [4, 4];

  const btnColors = ["red", "orange", "yellow", "white"];
  const btns = Array(top * bottom)
    .fill(null)
    .map((v, i) => {
      const active = props.initialSequence[i];
      const bgColor = btnColors[Math.floor(i / top)] || "white";
      return {active, bgColor};
    });

  return (
    <div class="SequencerTrack" data-id={props.id}>
      <For each={btns}>
        {(item, i) => (
          <div class="btn-container">
            <span class="btn-label">{i() + 1}</span>
            <BeatButton
              initialActive={item.active}
              bgColor={item.bgColor}
              onClick={(active) => {
                props.onBtnClick(props.id, i(), !active);
              }}
            />
          </div>
        )}
      </For>
    </div>
  );
}
