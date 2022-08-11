import * as Tone from "tone";
import omit from 'lodash/omit';
import {Sequence} from "./types";
import * as tracks from "./tracks";

type AudioStore = {
  cur16th: number;
  eventIds: number[];
  sequences: Record<string, Sequence>;
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

export function registerSequence(store: AudioStore, sequence: Sequence) {
  store.sequences = {
    ...store.sequences,
    [sequence.id]: sequence,
  }
}

export function unregisterSequence(store: AudioStore, id: string) {
  if (!store.sequences[id]) return;

  store.sequences = omit(store.sequences, id);
}

export function updateSequence(store: AudioStore, id: string, sixteenth: number, on: boolean) {
  if (!store.sequences[id]) {
    throw Error(`Sequence [${id}] does not exist. Cannot update.`);
  }
  if (!store.sequences[id].pattern[sixteenth]) {
    const len = store.sequences[id].pattern.length;
    throw Error(`Invalid update to sequence [${id}] of length ${len} with 16th of ${sixteenth}`);
  }
  store.sequences[id].pattern[sixteenth] = on;
}

export function registerTrack(store: AudioStore, track: tracks.Track) {
  store.tracks = {
    ...store.tracks,
    [track.id]: track,
  }
}

export function unregisterTrack(store: AudioStore, id: string) {
  if (!store.sequences[id]) return;

  store.sequences = omit(store.sequences, id);
}

