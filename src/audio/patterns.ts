import {InstrumentId, ApiPattern, ApiTimeSignature} from '@/api/types';
import {trackToClientTrack, ClientTrack} from './tracks';

export type ClientPattern = {
  id: string;
  name: string;
  trackIds: string[];
};

export function patternToClientPattern(pat: ApiPattern, timeSig: ApiTimeSignature): [ClientPattern, ClientTrack[]] {
  const { id, name, tracks } = pat;
  const clientTracks = tracks.map((t) => trackToClientTrack(t, timeSig));
  const clientPattern = {
    id,
    name: name || '',
    trackIds: clientTracks.map(t => t.id),
  };

  return [clientPattern, clientTracks];
}

