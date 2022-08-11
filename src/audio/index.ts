import * as Tone from "tone";
import * as store from './store';
import * as tracks from "./tracks";
import * as patterns from "./patterns";
import * as instruments from "./instruments";
import * as util from './util';

export * from "./types";

export const audioStore = store.create();

type AudioEvent = "sixteenthTick" | "stop" | "start";

function loop(time: number) {
  // Update the current 16th
  audioStore.cur16th = (audioStore.cur16th + 1) % 16;
  Tone.Transport.emit("sixteenthTick", audioStore.cur16th);

  if (!audioStore.curPattern) return;

  // Find the current pattern to play
  const pattern = audioStore.patternMap[audioStore.curPattern];

  for (const trackId of pattern.trackIds) {
    const track = audioStore.trackMap[trackId];
    if (!track) continue;

    const instrument = audioStore.instrumentMap[track.instrumentId];

    const isActive = track.sequence[audioStore.cur16th];
    if (!isActive) continue;

    instruments.play(instrument, time);
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

function state(): "started" | "stopped" | "paused" {
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
  // General fns
  init,
  play,
  stop,
  pause,
  setBpm,
  cleanup,
  subscribe,
  unsubscribe,
  state,
  audioStore,
  // modules
  store,
  instruments,
  tracks,
  patterns,
  util,
}
