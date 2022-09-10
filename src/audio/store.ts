import * as Tone from 'tone';
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
  songName: string;
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
    songName: "",
    instrumentMap: {},
    trackMap: {},
    patternMap: {},
    playState: "stopped",
  }
}


export async function importSongToAudioStore(song: Song) {
  const clientPatternArr = song.patterns.map((pat) => patterns.patternToClientPattern(pat, song.timeSignature));
  const cTracksArr = clientPatternArr.map(([_, cTracks]) => cTracks);

  const cIns = await Promise.all(song.instruments.map(instruments.instrumentToClientInstrument));
  const cPatterns = clientPatternArr.map(([cPattern]) => cPattern);
  const cTracks = flatten(cTracksArr);

  const instrumentMap = zipObject(cIns.map(c => c.id), cIns);
  const patternMap = zipObject(cPatterns.map(p => p.id), cPatterns);
  const trackMap = zipObject(cTracks.map(t => t.id), cTracks);

  setStore({
    bpm: song.bpm || 120,
    instrumentMap,
    patternMap,
    trackMap,
  });
}

export function updateTrackSequence(id: string, sixteenth: number, on: boolean) {
  const track = audioStore.trackMap[id];
  if (!track) {
    throw Error(`Invalid update to a track with id [${id}]. Are you sure that track exists?`);
  }
  if ((track.sequence.length - 1) < sixteenth) {
    throw Error(`Invalid update to track with sequence length of [${track.sequence.length}].`);
  }
  const newSequence = [...track.sequence];
  newSequence[sixteenth] = on;
  setStore("trackMap", id, "sequence", newSequence);
}

export function setBpm(bpm: number) {
  if (bpm <= 0) return;

  setStore({ bpm });
  Tone.Transport.bpm.value = bpm;
}

