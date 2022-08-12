import {JSX, createSignal} from 'solid-js'
import './BeatButton.css'

type Props = {
  initialActive: boolean;
  bgColor?: string;
  onClick?: (active: boolean) => void;
} & Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'onClick'>;

export default function BeatButton(props: Props) {
  const [active, setActive] = createSignal(props.initialActive);

  return (
    <button
      class={`BeatButton ${props.bgColor}`}
      onClick={(_e) => {
        setActive(!active());
        if (props.onClick) {
          props.onClick(!active());
        }
      }}
    >
      <div class="BeatButton--led-container">
        <div class={`BeatButton--led ${active() ? 'active' : undefined}`} />
      </div>
    </button>
  )
}
