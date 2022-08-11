import {InstrumentId} from './types';

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

export function updateSequence(track: ClientTrack, idx: number, on: boolean) {
  const len = track.sequence.length;
  if ((len - 1) < idx) {
    throw new Error(`Can't update track of length [${len}] with index of [${idx}]`);
  }

  track.sequence[idx] = on;
}
