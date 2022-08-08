import * as Tone from "tone";
import { Bar } from "./types";
export * from "./types";

const osc = new Tone.Oscillator().toDestination();

const audioState = {
  cur16th: -1,
  eventIds: [] as number[],
}

export function setPattern(bar: Bar) {
  bar.sequence.forEach((note, i) => {
    const [beat, sixteenth] = note.startTime;

    Tone.Transport.schedule((time) => {
      osc.start(time).stop(time + note.length);
    }, `0:${beat}:${sixteenth}`);
  });
}

type AudioEvent = "sixteenthTick";

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
  Tone.Transport.setLoopPoints("0:0:0", "1:0:0");
  Tone.Transport.loop = true;
  const evId = Tone.Transport.scheduleRepeat(function (time) {
    audioState.cur16th = (audioState.cur16th + 1) % 16;
    Tone.Transport.emit("sixteenthTick", audioState.cur16th);
  }, "16n");
  audioState.eventIds.push(evId);
}

export function cleanup() {
  console.log({audioState})
  audioState.eventIds.forEach((id) => Tone.Transport.clear(id));
}

export function setBpm(bpm: number) {
  Tone.Transport.bpm.value = bpm;
}

export function state(): string {
  return Tone.Transport.state;
}

export function play() {
  Tone.Transport.start();
}

export function pause() {
  Tone.Transport.pause();
}

export function stop() {
  Tone.Transport.clear(0);
  cur16th = -1;
  Tone.Transport.stop();
}
