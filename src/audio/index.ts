import * as Tone from "tone";
import omit from 'lodash/omit';
import {Note, Sequence} from "./types";
import * as tracks from "./tracks";
export * from "./types";
export * as util from './util';
export { tracks };

type AudioEvent = "sixteenthTick" | "stop" | "start";

type AudioStore = {
  cur16th: number;
  eventIds: number[];
  sequences: Record<string, Sequence>;
  tracks: Record<string, tracks.Track>;
}
const audioStore: AudioStore = {
  cur16th: -1,
  eventIds: [],
  sequences: {},
  tracks: {},
}

function loop(time: number) {
  audioStore.cur16th = (audioStore.cur16th + 1) % 16;
  Tone.Transport.emit("sixteenthTick", audioStore.cur16th);

  for (const id of Object.keys(audioStore.tracks)) {
    const track = audioStore.tracks[id];
    const isActive = audioStore.sequences[id].pattern[audioStore.cur16th];
    if (!isActive) continue;

    tracks.play(track, time);
  }
}

export function registerSequence(sequence: Sequence) {
  audioStore.sequences = {
    ...audioStore.sequences,
    [sequence.id]: sequence,
  }
}

export function unregistertrack(id: string) {
  if (!audioStore.tracks[id]) return;

  audioStore.tracks = omit(audioStore.tracks, id);
}

export function registerTrack(track: tracks.Track) {
  audioStore.tracks = {
    ...audioStore.tracks,
    [track.id]: track,
  }
}

export function unregisterTrack(id: string) {
  if (!audioStore.sequences[id]) return;

  audioStore.sequences = omit(audioStore.sequences, id);
}

export function updateSequence(id: string, sixteenth: number, on: boolean) {
  if (!audioStore.sequences[id]) {
    throw Error(`Sequence [${id}] does not exist. Cannot update.`);
  }
  if (!audioStore.sequences[id].pattern[sixteenth]) {
    const len = audioStore.sequences[id].pattern.length;
    throw Error(`Invalid update to sequence [${id}] of length ${len} with 16th of ${sixteenth}`);
  }

  audioStore.sequences[id].pattern[sixteenth] = on;
}

/***
 * Do something on some event
 */
export function subscribe(name: AudioEvent, callback: Function) {
  // @ts-ignore
  Tone.Transport.on(name, callback);
}

export function unsubscribe(name: AudioEvent, callback: Function) {
  // @ts-ignore
  Tone.Transport.off(name, callback);
}

export function init() {
  console.log('Setting up audio environment');
  Tone.Transport.setLoopPoints("0:0:0", "1:0:0");
  Tone.Transport.loop = true;
  const evId = Tone.Transport.scheduleRepeat(loop, "16n");
  audioStore.eventIds.push(evId);
  Tone.setContext(new Tone.Context({latencyHint: "playback"}))
}

export function cleanup() {
  audioStore.eventIds.forEach((id) => {
    Tone.Transport.clear(id)
    audioStore.eventIds = audioStore.eventIds.slice(1);
  });
}

export function setBpm(bpm: number) {
  Tone.Transport.bpm.value = bpm;
}

export function state(): string {
  return Tone.Transport.state;
}

export function play() {
  Tone.Transport.start(0);
}

export function pause() {
  Tone.Transport.pause();
}

export function stop() {
  cleanup();
  audioStore.cur16th = -1;
  Tone.Transport.stop();
}
