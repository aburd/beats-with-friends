import {InstrumentId, TimeSignature, Track} from './types';
import {v4 as uuid} from 'uuid';

export type ClientTrack = {
  id: string;
  instrumentId: InstrumentId;
  sequence: boolean[];
}

export function create(id: string, instrumentId: InstrumentId, sequence: boolean[]): ClientTrack {
  return {
    id,
    instrumentId,
    sequence,
  }
}

export function trackToClientTrack(track: Track, timeSig: TimeSignature): ClientTrack {
  const {instrumentId, sequence} = track;
  const [top, bot] = timeSig;
  const activeSixteenths = sequence
    .map(({startTime}) => (startTime[0] * top) + startTime[1]);
  const clientSeq: boolean[] = Array(top * bot)
    .fill(null)
    .map((_, i) => activeSixteenths.includes(i));
  return {id: uuid(), instrumentId, sequence: clientSeq};
}

export function updateSequence(track: ClientTrack, idx: number, on: boolean) {
  const len = track.sequence.length;
  if ((len - 1) < idx) {
    throw new Error(`Can't update track of length [${len}] with index of [${idx}]`);
  }

  track.sequence[idx] = on;
}
