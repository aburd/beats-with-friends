import {JSX, createSignal} from 'solid-js'
import './BeatButton.css'

type Props = {
  initialActive: boolean;
  bgColor?: string;
  onClick?: (active: boolean) => void;
} & Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'onClick'>;

export default function BeatButton({
  initialActive = false,
  bgColor = 'white',
  onClick = () => {},
  ...rest
}: Props) {
  const [active, setActive] = createSignal(initialActive);

  return (
    <button
      class={`BeatButton ${bgColor}`}
      onClick={() => {
        setActive(!active);
        onClick(!active);
      }}
      {...rest}>
      <div class="BeatButton--led-container">
        <div class={`BeatButton--led ${active() ? 'active' : undefined}`} />
      </div>
    </button>
  )
}
