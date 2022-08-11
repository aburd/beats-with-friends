import * as Tone from 'tone';
import { createEffect } from 'solid-js';
import * as patterns from './patterns';
import * as tracks from './tracks';
import * as instruments from "./instruments";
import {Song} from './types';
import {TimeSignature} from './types';
import {createStore} from "solid-js/store";
import flatten from 'lodash/flatten';
import zipObject from 'lodash/zipObject';

export const [audioStore, setStore] = createStore(initialStore(), {name: 'audio-store'});

export type AudioStore = {
  cur16th: number;
  curPattern: string | null;
  timeSignature: TimeSignature | null;
  bpm: number;
  eventIds: number[];
  instrumentMap: Record<string, instruments.ClientInstrument>;
  trackMap: Record<string, tracks.ClientTrack>;
  patternMap: Record<string, patterns.ClientPattern>;
  playState: "started" | "stopped" | "paused";
}

function initialStore(): AudioStore {
  return {
    cur16th: -1,
    curPattern: '1',
    timeSignature: [4, 4],
    bpm: 120,
    eventIds: [],
    instrumentMap: {},
    trackMap: {},
    patternMap: {},
    playState: "stopped",
  }
}

export function importSongToAudioStore(song: Song) {
  const clientPatternArr = song.patterns.map((pat) => patterns.patternToClientPattern(pat, song.timeSignature));
  const cTracksArr = clientPatternArr.map(([_, cTracks]) => cTracks);

  const cIns = song.instruments.map(instruments.instrumentToClientInstrument);
  const cPatterns = clientPatternArr.map(([cPattern]) => cPattern);
  const cTracks = flatten(cTracksArr);

  const instrumentMap = zipObject(cIns.map(c => c.id), cIns);
  const patternMap = zipObject(cPatterns.map(p => p.id), cPatterns);
  const trackMap = zipObject(cTracks.map(t => t.id), cTracks);

  setStore({
    instrumentMap,
    patternMap,
    trackMap,
  });
}

createEffect(() => Tone.Transport.bpm.value = audioStore.bpm);
