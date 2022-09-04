import {createStore} from "solid-js/store";
import * as Tone from 'tone';
import flatten from 'lodash/flatten';
import zipObject from 'lodash/zipObject';
import * as patterns from './patterns';
import * as tracks from './tracks';
import * as instruments from "./instruments";
import {TimeSignature} from './types';
import {ApiSong} from '@/api/types';

const [store, setStore] = createStore(initialStore(), {name: 'audio-store'});
export { store };

type PlayState = "started" | "stopped" | "paused";

export type AudioStore = {
  playState: PlayState;
  curPattern: string | null;
  cur16th: number;
  song: {
    id: string;
    name: string;
    bpm: number;
    timeSignature: TimeSignature;
  };
  instrumentMap: Record<string, instruments.ClientInstrument>;
  trackMap: Record<string, tracks.ClientTrack>;
  patternMap: Record<string, patterns.ClientPattern>;
}

function initialStore(): AudioStore {
  return {
    playState: "stopped",
    cur16th: -1,
    curPattern: '1',
    song: {
      id: "",
      name: "",
      bpm: 120,
      timeSignature: [4, 4],
    },
    instrumentMap: {},
    trackMap: {},
    patternMap: {},
  }
}

export function setPlayState(playState: PlayState) {
  setStore({ playState });
}

export function set16th(cur16th: number) {
  if (cur16th > (store.song.timeSignature[0] * store.song.timeSignature[1] - 1)) {
    throw new Error(`Cannot set a time signature larger than the time signature`)
  }
  setStore({ cur16th })
}

export function setCurPattern(curPattern: string) {
  if (!store.patternMap[curPattern]) {
    throw new Error(`${curPattern} is not a valid pattern.`);
  }
  setStore({ curPattern });
}

export function updateTrackSequence(id: string, sixteenth: number, on: boolean) {
  const track = store.trackMap[id];
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

export async function loadSong(song: ApiSong) {
  const clientPatternArr = song.patterns.map((pat) => patterns.patternToClientPattern(pat, song.timeSignature));
  const cTracksArr = clientPatternArr.map(([_, cTracks]) => cTracks);

  const cIns = await Promise.all(song.instruments.map(instruments.instrumentToClientInstrument));
  const cPatterns = clientPatternArr.map(([cPattern]) => cPattern);
  const cTracks = flatten(cTracksArr);

  const instrumentMap = zipObject(cIns.map(c => c.id), cIns);
  const patternMap = zipObject(cPatterns.map(p => p.id), cPatterns);
  const trackMap = zipObject(cTracks.map(t => t.id), cTracks);

  setStore({
    song: {
      id: song.id,
      name: song.name,
      bpm: song.bpm,
      timeSignature: song.timeSignature,
    },
    instrumentMap,
    patternMap,
    trackMap,
  });
}

export function setBpm(bpm: number) {
  if (bpm <= 0) return;
  setStore("song", "bpm", bpm);
  Tone.Transport.bpm.value = bpm;
}

// export function pushEventId()
