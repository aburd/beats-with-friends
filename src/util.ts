import {TimeSignature, Bar} from './audio/types'
import {Sequence} from './components/Sequencer'

export function barToSequence(timeSignature: TimeSignature, bar: Bar): Sequence {
  const [top, bottom] = timeSignature;
  const activeSixteenths = bar.sequence
    .map(({startTime}) => {
      return (startTime[0] * top) + startTime[1]
    });

  return {
    id: bar.instrumentId,
    initialSequence: Array(top * bottom)
      .fill(null)
      .map((_, i) => activeSixteenths.includes(i)),
  }
}

export function sixteethToBeat(n: number, top: number) {
  return Math.floor(n / top);
}
