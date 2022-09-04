import {InstrumentId, ApiPattern, ApiTimeSignature} from '@/api/types';
import {ClientInstrument} from "./instruments";
import {trackToClientTrack, ClientTrack, instrumentToTrack} from './tracks';

export type ClientPattern = {
  id: string;
  name: string;
  trackIds: string[];
};

export function patternToClientPattern(pat: ApiPattern, timeSig: ApiTimeSignature, instruments: ClientInstrument[]): [ClientPattern, ClientTrack[]] {
  const { id, name, tracks } = pat;
  const clientTracks = tracks.map((t) => trackToClientTrack(t, timeSig));
  const clientPattern = {
    id,
    name: name || '',
    trackIds: clientTracks.map(t => t.id),
  };
  const filled = instruments.map(ins => {
    const track = clientTracks.find(t => t.instrumentId === ins.id);
    if (track) {
      return track; 
    }
    return instrumentToTrack(ins, timeSig); 
  })

  return [clientPattern, filled];
}

