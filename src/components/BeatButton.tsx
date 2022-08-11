import React, {useState} from 'react'
import './BeatButton.css'

type Props = {
  initialActive: boolean;
  bgColor?: string;
  onClick?: (active: boolean) => void;
} & Omit<React.HTMLAttributes<HTMLButtonElement>, 'onClick'>;

export default function BeatButton({
  initialActive = false,
  bgColor = 'white',
  onClick = () => {},
  ...rest
}: Props) {
  const [active, setActive] = useState(initialActive);

  return (
    <button
      className={`BeatButton ${bgColor}`}
      onClick={() => {
        setActive(!active);
        onClick(!active);
      }}
      {...rest}>
      <div className="BeatButton--led-container">
        <div className={`BeatButton--led ${active ? 'active' : ''}`} />
      </div>
    </button>
  )
}
