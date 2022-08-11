import omit from 'lodash/omit';
import * as patterns from './patterns';
import * as tracks from './tracks';
import * as instruments from "./instruments";

export type AudioStore = {
  cur16th: number;
  curPattern: string | null;
  eventIds: number[];
  instrumentMap: Record<string, instruments.ClientInstrument>;
  trackMap: Record<string, tracks.ClientTrack>;
  patternMap: Record<string, patterns.ClientPattern>;
}

export function create(): AudioStore {
  return {
    cur16th: -1,
    curPattern: '1',
    eventIds: [],
    instrumentMap: {},
    trackMap: {},
    patternMap: {},
  }
}

/**
 * @return {string} The ID of the pattern
 */
export function registerPattern(store: AudioStore, pattern: patterns.ClientPattern): string {
  store.patternMap = {
    ...store.patternMap,
    [pattern.id]: pattern,
  }
  return pattern.id;
}

export function unregisterPattern(store: AudioStore, id: string) {
  if (!store.patternMap[id]) return;

  store.patternMap = omit(store.patternMap, id);
}

/**
 * @return {string} The ID of the instrument
 */
export function registerInstrument(store: AudioStore, instrument: instruments.ClientInstrument) {
  store.instrumentMap = {
    ...store.instrumentMap,
    [instrument.id]: instrument,
  }
  return instrument.id;
}

export function unregisterInstrument(store: AudioStore, id: string) {
  if (!store.instrumentMap[id]) return;

  store.instrumentMap = omit(store.instrumentMap, id);
}

/**
 * @return {string} The ID of the track
 */
export function registerTrack(store: AudioStore, track: tracks.ClientTrack) {
  store.trackMap = {
    ...store.trackMap,
    [track.id]: track,
  }
  return track.id;
}

export function unregisterTrack(store: AudioStore, id: string) {
  if (!store.trackMap[id]) return;

  store.trackMap = omit(store.trackMap, id);
}
