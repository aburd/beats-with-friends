// FIREBASE DB TYPES 
export type DbNote = {
  startTime: {
    beat: number;
    sixteenth: number;
  },
  length: number;
};

export type DbTrack = {
  instrumentId: string;
  notes: Record<string, DbNote>;
};

export type DbPattern = {
  name: string;
  tracks: Record<string, DbTrack>;
}

export type DbInstrument = {
  name: string;
  url: string;
};

export type DbSong = {
  name: string;
  bpm: number;
  timeSignature: {
    top: number;
    bottom: number;
  },
  instruments: Record<string, DbInstrument>,
  patterns: Record<string, DbPattern>,
  sheet: Record<string, boolean>,
};

// PROVIDED TO CLIENT FROM API
/**
 * A colon-separated representation of time in the form of
 * Bars:Beats:Sixteenths.
 */
export type ApiBeatsSixteenths = [number, number];
export type ApiTimeSignature = [number, number];

export type ApiNote = {
  id: string;
  startTime: ApiBeatsSixteenths;
  length: number, // in seconds
}

export type InstrumentId = string;
export type ApiInstrument = {
  id: InstrumentId;
  name: string;
  url?: string;
}

export type ApiTrack = {
  id: string,
  instrumentId: InstrumentId,
  sequence: ApiNote[]
}

type PatternId = string;
export type ApiPattern = {
  id: PatternId;
  name?: string;
  tracks: ApiTrack[];
}

type Time = [number, number, number];

export type ApiSong = {
  id: string,
  name: string;
  timeSignature: ApiTimeSignature;
  bpm: number;
  instruments: ApiInstrument[], 
  patterns: ApiPattern[], 
  sheet: Record<PatternId, Time[]>;
}


