/**
 * A colon-separated representation of time in the form of
 * Bars:Beats:Sixteenths.
 */
export type BeatsSixteenths = [number, number];

export interface Sample {
  id: string;
  url: string;
}

export type Note = {
  startTime: BeatsSixteenths;
  length: number, // in seconds
}

type InstrumentId = string | number;
export type Instrument = {
  name: string;
}

// Bars will be ordered, its index will maintain order
export type Bar = {
  instrumentId: InstrumentId,
  sequence: Note[]
}

type PatternId = string | number;

export type Pattern = {
  name: PatternId;
  bar: Bar[];
}

type Time = [number, number, number];

export type Song = {
  name: string;
  instruments: Record<InstrumentId, Instrument>,
  patterns: Record<PatternId, Pattern>;
  sheet: Record<PatternId, Time[]>;
}

