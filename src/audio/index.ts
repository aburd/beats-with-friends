import * as Tone from 'tone'
import {Bar} from './types'

const osc = new Tone.Oscillator().toDestination();

export function setPattern(instrumentId: string, bar: Bar) {
  bar.forEach((note, i) => {
    const [beat, sixteenth] = note.startTime;

    Tone.Transport.schedule((time) => {
      osc.start(time).stop(time + note.length);
    }, `0:${beat}:${sixteenth}`);
  });
}

export function init() {
  Tone.Transport.setLoopPoints("0:0:0", "1:0:0");
  Tone.Transport.loop = true;
}

export function setBpm(bpm: number) {
  Tone.Transport.bpm.value = bpm;
}

export function play() {
  Tone.Transport.start();
}

export function pause() {
  Tone.Transport.pause();
}

export function stop() {
  Tone.Transport.stop();
}
