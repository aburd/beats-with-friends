import {useState, useEffect} from 'react';
import SequencerBar from './SequencerBar'

type Props = {
  sequences: {
    id: string;
    initialSequence: boolean[];
  }[],
  initialPlaying?: boolean;
  onPlayClick: (playing: boolean) => void;
  onStopClick: () => void;
  onSequenceChange: (id: string, sequence: boolean[]) => void,
}

export default function Sequencer({
  sequences,
  initialPlaying = false,
  onPlayClick,
  onStopClick,
  onSequenceChange
}: Props) {
  const [playing, setPlaying] = useState(initialPlaying)

  useEffect(() => {
    onPlayClick(!playing);
  }, [playing])

  function handlePlayClick() {
    setPlaying(!playing);
  }

  return (
    <div className="Sequencer">
      <button onClick={handlePlayClick}>{playing ? 'Pause' : 'Play'}</button>
      <button onClick={onStopClick}>Stop</button>
      {sequences.map(({id, initialSequence}) => (
        <SequencerBar
          initialSequence={initialSequence}
          timeSignature={[4, 4]}
          onSequenceChange={(sequence) => {
            onSequenceChange('instrument', sequence);
          }}
        />
      )
      )}
    </div>
  )
}
