import {InstrumentId, Pattern, TimeSignature} from './types';
import {trackToClientTrack, ClientTrack} from './tracks';

export type ClientPattern = {
  id: string;
  name: string;
  trackIds: string[];
};

export function create(id: string, name: string, trackIds: string[]): ClientPattern {
  return {
    id,
    name,
    trackIds,
  }
}

export function patternToClientPattern(pat: Pattern, timeSig: TimeSignature): [ClientPattern, ClientTrack[]] {
  const { id, name, tracks } = pat;
  const clientTracks = tracks.map((t) => trackToClientTrack(t, timeSig));
  const clientPattern = {
    id,
    name: name || '',
    trackIds: clientTracks.map(t => t.id),
  };

  return [clientPattern, clientTracks];
}

export function addTrack(pattern: ClientPattern, trackId: string) {
  pattern.trackIds.push(trackId); 
}

export function removeTrack(pattern: ClientPattern, trackId: string) {
  pattern.trackIds = pattern.trackIds.filter(id => id !== trackId);
}
