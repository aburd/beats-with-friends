import * as Tone from "tone";
import * as tracks from "./tracks";
import * as store from './store';

export * from "./types";
export * as sequences from './sequences';
export * as util from './util';
export { tracks, store };

export const audioStore = store.create();

type AudioEvent = "sixteenthTick" | "stop" | "start";

function loop(time: number) {
  audioStore.cur16th = (audioStore.cur16th + 1) % 16;
  Tone.Transport.emit("sixteenthTick", audioStore.cur16th);

  for (const id of Object.keys(audioStore.tracks)) {
    const track = audioStore.tracks[id];
    const sequence = audioStore.sequences[id];
    if (!sequence) continue;

    const isActive = sequence.pattern[audioStore.cur16th];
    if (!isActive) continue;

    tracks.play(track, time);
  }
}

function init() {
  console.log('Setting up audio environment');
  Tone.Transport.setLoopPoints("0:0:0", "1:0:0");
  Tone.Transport.loop = true;
  const evId = Tone.Transport.scheduleRepeat(loop, "16n");
  audioStore.eventIds.push(evId);
  Tone.setContext(new Tone.Context({latencyHint: "playback"}))
}

function subscribe(name: AudioEvent, callback: Function) {
  // @ts-ignore
  Tone.Transport.on(name, callback);
}

function unsubscribe(name: AudioEvent, callback: Function) {
  // @ts-ignore
  Tone.Transport.off(name, callback);
}

export function cleanup() {
  audioStore.eventIds.forEach((id) => {
    Tone.Transport.clear(id)
    audioStore.eventIds = audioStore.eventIds.slice(1);
  });
}

function setBpm(bpm: number) {
  Tone.Transport.bpm.value = bpm;
}

function state(): string {
  return Tone.Transport.state;
}

function play() {
  Tone.Transport.start(0);
}

function pause() {
  Tone.Transport.pause();
}

function stop() {
  cleanup();
  audioStore.cur16th = -1;
  Tone.Transport.stop();
}

export default {
  init,
  play,
  stop,
  pause,
  setBpm,
  cleanup,
  subscribe,
  unsubscribe,
  audioStore,
  state,
}
