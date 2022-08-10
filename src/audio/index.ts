import * as Tone from "tone";
import omit from "lodash/omit";
import { Sequence, SequenceMap } from "./types";
export * from "./types";
export * as util from "./util";

const osc = new Tone.Oscillator().toDestination();

const clap = new Tone.Sampler({
  urls: {
    A1: "snare.wav",
  },
  baseUrl: location.origin + "/samples/",
}).toDestination();

const kick = new Tone.Sampler({
  urls: {
    A1: "kick(2).wav",
  },
  baseUrl: location.origin + "/samples/",
}).toDestination();

const samples = {
  "1": "kick",
  "2": "clap",
};

type AudioState = {
  cur16th: number;
  eventIds: number[];
  sequences: SequenceMap;
};

const audioState: AudioState = {
  cur16th: -1,
  eventIds: [],
  sequences: {},
};

function loop(time: number) {
  audioState.cur16th = (audioState.cur16th + 1) % 16;
  Tone.Transport.emit("sixteenthTick", audioState.cur16th);
  console.log('16:', audioState.cur16th);

  const ids = Object.keys(audioState.sequences);
  for (const id of ids) {
    const notes = audioState.sequences[id];
    const note = notes[audioState.cur16th];
    if (!note) return;

    // @ts-ignore
    if (samples[id] === "kick") {
      kick.triggerAttackRelease(["A1"], 0.5);
    }
    // @ts-ignore
    if (samples[id] === "clap") {
      clap.triggerAttackRelease(["A1"], 0.5);
    }
  }
}

export function registerSequence(sequence: Sequence) {
  const { id, notes } = sequence;
  audioState.sequences = {
    ...audioState.sequences,
    [id]: notes,
  };
}

export function unregisterSequence(id: string) {
  if (!audioState.sequences[id]) return;

  audioState.sequences = omit(audioState.sequences, id);
}

export function updateSequence(id: string, sixteenth: number, on: boolean) {
  if (!audioState.sequences[id]) {
    throw Error(`Sequence [${id}] does not exist. Cannot update.`);
  }
  if (audioState.sequences[id].length - 1 < sixteenth) {
    throw Error(
      `Invalid update to sequence [${id}] of length ${audioState.sequences[id].length} with 16th of ${sixteenth}`
    );
  }

  audioState.sequences[id][sixteenth] = on;
}

type AudioEvent = "sixteenthTick" | "stop" | "start";

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
  console.log('initting...')
  Tone.Transport.setLoopPoints("0:0:0", "1:0:0");
  // Tone.Transport.loop = true;
  // Tone.setContext(new Tone.Context({ latencyHint: "playback" }));
  const evId = Tone.Transport.scheduleRepeat(loop, "16n");
  audioState.eventIds.push(evId);
}

export function cleanup() {
  audioState.eventIds.forEach((id) => {
    Tone.Transport.clear(id);
    audioState.eventIds = audioState.eventIds.slice(1);
  });
}

export function setBpm(bpm: number) {
  Tone.Transport.bpm.value = bpm;
}

export function state(): string {
  return Tone.Transport.state;
}

export function play() {
  console.log("Playing");
  Tone.Transport.start();
}

export function pause() {
  console.log("Pausing");
  Tone.Transport.pause();
}

export function stop() {
  audioState.cur16th = -1;
  Tone.Transport.stop();
}
