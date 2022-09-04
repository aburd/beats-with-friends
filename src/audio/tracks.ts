import log from "loglevel";
import {InstrumentId, ApiTimeSignature, ApiTrack} from '@/api/types';
import {store, setStore} from "./store";
import {v4 as uuid} from 'uuid';

export type ClientTrack = {
  id: string;
  instrumentId: InstrumentId;
  sequence: boolean[];
}

export function addTrack(track: ClientTrack) {
   log.debug(`Adding track: ${track}`);
}

export function trackToClientTrack(track: ApiTrack, timeSig: ApiTimeSignature): ClientTrack {
  const {instrumentId, sequence} = track;
  const [top, bot] = timeSig;
  const activeSixteenths = sequence
    .map(({startTime}) => (startTime[0] * top) + startTime[1]);
  const clientSeq: boolean[] = Array(top * bot)
    .fill(null)
    .map((_, i) => activeSixteenths.includes(i));
  return {id: uuid(), instrumentId, sequence: clientSeq};
}

