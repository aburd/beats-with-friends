/**
 * A colon-separated representation of time in the form of
 * Bars:Beats:Sixteenths.
 */
export type BeatsSixteenths = [number, number];

export type TimeSignature = [number, number];

export type Note = {
  startTime: BeatsSixteenths;
  length: number, // in seconds
}

export type InstrumentId = string;
export type Instrument = {
  id: InstrumentId;
  name: string;
  url?: string;
}

export type Track = {
  instrumentId: InstrumentId,
  sequence: Note[]
}

type PatternId = string | number;

export type Pattern = {
  id: PatternId;
  name?: string;
  tracks: Track[];
}

type Time = [number, number, number];

export type Song = {
  name: string;
  timeSignature: TimeSignature;
  instruments: Instrument[], 
  patterns: Pattern[], 
  sheet: Record<PatternId, Time[]>;
}


