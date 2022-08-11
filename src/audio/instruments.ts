import * as Tone from "tone";
import { Instrument } from './types';
import * as util from './util';

export interface ClientInstrument {
  id: string;
  name: string;
  meter: Tone.Meter;
  sampler?: Tone.Sampler;
  synth?: Tone.Synth;
}

type OscType = "square8";

const DEFAULT_INSTRUMENT_DECIBEL = -15;

/**
 * Creates a sampler instrument, for now this will only support one sample with
 * different pitches being played by repitching
 * @param {string} samplerUrl - e.g. "kick.wav", assumes sample is available on server
 * @param {OscType} oscType - "square8" 
 * @param {string?} name - The name of the instrument. Defaults to 'New Instrument'
 */
export function create(
  id: string,
  opts: {
  samplerUrl?: string,
  oscType?: OscType,
  name?: string,
}
): ClientInstrument {
  if (opts.samplerUrl && opts.oscType) {
    throw TypeError(`Cannot create instrument that is both samples [${opts.samplerUrl}] and synth [${opts.oscType}]`);
  }
  if (!(opts.samplerUrl || opts.oscType)) {
    throw TypeError(`Instrument must be created with samplerUrl or oscType`);
  }

  let sampler, synth;
  const meter = new Tone.Meter();

  if (opts.samplerUrl) {
    sampler = createSampler(opts.samplerUrl, meter);
  }
  if (opts.oscType) {
    synth = createSynth(opts.oscType, meter);
  }

  return {
    id,
    name: opts.name || 'New Instrument',
    meter,
    sampler,
  }
}

export function instrumentToClientInstrument(ins: Instrument): ClientInstrument {
  if (ins.url) {
    return create(ins.id, { samplerUrl: ins.url, name: ins.name });
  }
  return create(ins.id, { name: ins.name });
}

export function play(instrument: ClientInstrument, time: number, note?: string, duration?: string): void {
  if (instrument.sampler) {
    instrument.sampler.triggerAttackRelease(note || "A1", duration || "16n", time);
  }
  if (instrument.synth) {
    instrument.synth.triggerAttackRelease(note || "A1", duration || "16n", time);
  }
}

export function meterValue(instrument: ClientInstrument): number | number[] {
  return instrument.meter.getValue();
}

function createSampler(samplerUrl: string, meter: Tone.Meter): Tone.Sampler {
  return new Tone.Sampler({
    urls: {
      A1: samplerUrl,
    },
    baseUrl: util.sampleBaseUrl(),
    volume: DEFAULT_INSTRUMENT_DECIBEL,
  })
    .connect(meter)
    .toDestination();
}

function createSynth(oscType: "square8", meter: Tone.Meter): Tone.Synth {
  return new Tone.Synth({oscillator: {type: oscType}, volume: DEFAULT_INSTRUMENT_DECIBEL})
    .connect(meter)
    .toDestination();
}

