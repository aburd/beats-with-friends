import omit from 'lodash/omit';
import * as sequences from './sequences';
import * as tracks from "./tracks";

type AudioStore = {
  cur16th: number;
  eventIds: number[];
  sequences: Record<string, sequences.Sequence>;
  tracks: Record<string, tracks.Track>;
}

export function create(): AudioStore {
  return {
    cur16th: -1,
    eventIds: [],
    sequences: {},
    tracks: {},
  }
}

/**
 * @return {string} The ID of the sequence
 */
export function registerSequence(store: AudioStore, sequence: sequences.Sequence): string {
  store.sequences = {
    ...store.sequences,
    [sequence.id]: sequence,
  }
  return sequence.id;
}

export function unregisterSequence(store: AudioStore, id: string) {
  if (!store.sequences[id]) return;

  store.sequences = omit(store.sequences, id);
}

export function updateSequence(store: AudioStore, id: string, sixteenth: number, on: boolean) {
  if (!store.sequences[id]) {
    throw Error(`Sequence [${id}] does not exist. Cannot update.`);
  }
  sequences.updatePattern(store.sequences[id], sixteenth, on)
}

/**
 * @return {string} The ID of the track
 */
export function registerTrack(store: AudioStore, track: tracks.Track) {
  store.tracks = {
    ...store.tracks,
    [track.id]: track,
  }
  return track.id;
}

export function unregisterTrack(store: AudioStore, id: string) {
  if (!store.sequences[id]) return;

  store.sequences = omit(store.sequences, id);
}

