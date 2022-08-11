import * as Tone from "tone";
import {v4 as uuidv4} from 'uuid';
import * as util from './util';

export interface Track {
  id: string;
  name: string;
  meter: Tone.Meter;
  sampler?: Tone.Sampler;
  synth?: Tone.Synth;
}

type OscType = "square8";

const DEFAULT_TRACK_DECIBEL = -15;

/**
 * Creates a sampler track, for now this will only support one sample with
 * different pitches being played by repitching
 * @param {string} samplerUrl - e.g. "kick.wav", assumes sample is available on server
 * @param {OscType} oscType - "square8" 
 * @param {string?} name - The name of the track. Defaults to 'New Track'
 */
export function create(opts: {
  samplerUrl?: string,
  oscType?: OscType,
  name?: string,
}): Track {
  if (opts.samplerUrl && opts.oscType) {
    throw TypeError(`Cannot create track that is both samples [${opts.samplerUrl}] and synth [${opts.oscType}]`);
  }
  if (!(opts.samplerUrl || opts.oscType)) {
    throw TypeError(`Track must be created with samplerUrl or oscType`);
  }

  let sampler, synth;
  const id = uuidv4();
  const meter = new Tone.Meter();

  if (opts.samplerUrl) {
    sampler = createSampler(opts.samplerUrl, meter);
  }
  if (opts.oscType) {
    synth = createSynth(opts.oscType, meter);
  }

  return {
    id,
    name: opts.name || 'New Track',
    meter,
    sampler,
  }
}

export function play(track: Track, time: number, note?: string, duration?: string): void {
  if (track.sampler) {
    track.sampler.triggerAttackRelease(note || "A1", duration || "16n", time);
  }
  if (track.synth) {
    track.synth.triggerAttackRelease(note || "A1", duration || "16n", time);
  }
}

export function meterValue(track: Track): number | number[] {
  return track.meter.getValue();
}

function createSampler(samplerUrl: string, meter: Tone.Meter): Tone.Sampler {
  return new Tone.Sampler({
    urls: {
      A1: samplerUrl,
    },
    baseUrl: util.sampleBaseUrl(),
    volume: DEFAULT_TRACK_DECIBEL,
  })
    .connect(meter)
    .toDestination();
}

function createSynth(oscType: "square8", meter: Tone.Meter): Tone.Synth {
  return new Tone.Synth({oscillator: {type: oscType}, volume: DEFAULT_TRACK_DECIBEL})
    .connect(meter)
    .toDestination();
}

