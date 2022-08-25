import * as Tone from "tone";
import log from "loglevel";
import debug from "./debug";
import * as tracks from "./tracks";
import * as patterns from "./patterns";
import * as instruments from "./instruments";
import * as util from "./util";
// TODO: I hate this import export make export make more sense
import {
  updateTrackSequence,
  importSongToAudioStore,
  audioStore,
  setStore,
} from "./store";
export * from "./types";

type AudioEvent = "sixteenthTick" | "stop" | "start";

function loop(time: number) {
  // Update the current 16th
  setStore({ cur16th: (audioStore.cur16th + 1) % 16 });
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

    log.debug(`Scheduling ${instrument.name} at ${time}`)
    instruments.play(instrument, time);
  }
}

function init() {
  log.info("Setting up audio environment");
  Tone.Transport.setLoopPoints("0:0:0", "1:0:0");
  Tone.Transport.loop = true;
  const evId = Tone.Transport.scheduleRepeat(loop, "16n");
  setStore({ eventIds: [...audioStore.eventIds, evId] });
  // Tone.setContext(new Tone.Context({ latencyHint: "playback" }));
}

export function cleanup() {
  // audioStore.eventIds.forEach((id) => {
  //   Tone.Transport.clear(id)
  // });
  Tone.Transport.cancel(0);
  Tone.Transport.pause(0);
  setStore({ eventIds: [] });
}

function play() {
  Tone.Transport.start();
  setStore({ playState: "started" });
}

function pause() {
  Tone.Transport.pause();
  setStore({ playState: "paused" });
}

function stop() {
  // cleanup();
  setStore({ cur16th: -1 });
  Tone.Transport.stop();
  setStore({ playState: "stopped" });
}

export default {
  // General fns
  init,
  play,
  stop,
  pause,
  cleanup,
  audioStore,
  setStore,
  importSongToAudioStore,
  updateTrackSequence,
  // modules
  instruments,
  tracks,
  patterns,
  util,
  debug,
};
