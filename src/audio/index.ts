import * as Tone from "tone";
import log from "loglevel";
import debug from "./debug";
import * as tracks from "./tracks";
import * as patterns from "./patterns";
import * as instruments from "./instruments";
import * as util from "./util";
import * as storage from "./store";

type AudioEvent = "sixteenthTick" | "stop" | "start";

function loop(time: number) {
  // Update the current 16th
  storage.set16th((storage.store.cur16th + 1) % 16);
  Tone.Transport.emit("sixteenthTick" as AudioEvent, storage.store.cur16th);

  if (!storage.store.curPattern) return;

  // Find the current pattern to play
  const pattern = storage.store.patternMap[storage.store.curPattern];

  for (const trackId of pattern.trackIds) {
    const track = storage.store.trackMap[trackId];
    if (!track) continue;

    const instrument = storage.store.instrumentMap[track.instrumentId];

    const isActive = track.sequence[storage.store.cur16th];
    if (!isActive) continue;

    log.debug(`Scheduling ${instrument.name} at ${time}`);
    instruments.play(instrument, time);
  }
}

function init() {
  log.info("Setting up audio environment");
  Tone.Transport.setLoopPoints("0:0:0", "1:0:0");
  Tone.Transport.loop = true;
  const evId = Tone.Transport.scheduleRepeat(loop, "16n");
}

export function cleanup() {
  Tone.Transport.cancel(0);
  Tone.Transport.pause(0);
}

function play() {
  Tone.Transport.start();
  storage.setPlayState("started");
}

function pause() {
  Tone.Transport.pause();
  storage.setPlayState("paused");
}

function stop() {
  // cleanup();
  storage.set16th(-1);
  Tone.Transport.stop();
  storage.setPlayState("stopped");
}

export default {
  // General fns
  init,
  play,
  stop,
  pause,
  cleanup,
  // modules
  instruments,
  tracks,
  patterns,
  util,
  debug,
  store: storage.store,
  loadSong: storage.loadSong,
  setBpm: storage.setBpm,
  updateTrackSequence: storage.updateTrackSequence,
  setCurPattern: storage.setCurPattern,
};
