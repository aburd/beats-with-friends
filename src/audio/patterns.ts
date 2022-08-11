import {InstrumentId} from './types';

export type ClientPattern = {
  id: string;
  trackIds: string[];
};

export function create(id: string, trackIds: string[]): ClientPattern {
  return {
    id,
    trackIds,
  }
}

export function addTrack(pattern: ClientPattern, trackId: string) {
  pattern.trackIds.push(trackId); 
}

export function removeTrack(pattern: ClientPattern, trackId: string) {
  pattern.trackIds = pattern.trackIds.filter(id => id !== trackId);
}
