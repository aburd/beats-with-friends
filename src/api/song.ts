import {onValue, getDatabase, ref, set, update, push, child, get} from "firebase/database";
import log from "loglevel";
import {zipObject} from "lodash";
import {TurnModeState} from "../types";
import * as util from "./util";
import {AudioStore} from "../audio/store";
import {ClientInstrument} from "../audio/instruments";
import {ClientPattern} from "../audio/patterns";
import {ClientTrack} from "../audio/tracks";
import sampleApi from "./samples";
import { 
  DbSong, DbNote, DbInstrument, DbPattern, DbTrack,
  ApiSong, ApiBeatsSixteenths, ApiTimeSignature,
} from './types';

export type SongApiErrorCode =
  "unknown";
export type SongApiError = {
  description: string;
  code: SongApiErrorCode;
}

function sequenceToNote(sixteenth: number, top: number): DbNote {
  return {
    startTime: {
      beat: Math.floor(sixteenth / top),
      sixteenth: sixteenth % top,
    },
    length: 0.1,
  }
}

function instrumentMapToDbInstruments(instrumentMap: Record<string, ClientInstrument>): Record<string, DbInstrument> {
  const ids = Object.keys(instrumentMap);
  const cInstruments = Object.values(instrumentMap);
  const dbInstruments = cInstruments.map((cInstrument): DbInstrument => ({
    name: cInstrument.name,
    url: cInstrument.url,
  }));
  return zipObject(ids, dbInstruments)
}

function patternMapToDbPatterns(timeSignature: ApiTimeSignature, trackMap: Record<string, ClientTrack>, patternMap: Record<string, ClientPattern>): Record<string, DbPattern> {
  const ids = Object.keys(patternMap);
  const cPatterns = Object.values(patternMap);
  const dbPatterns = cPatterns.map((cPattern): DbPattern => {
    log.debug({cPattern})
    const dbTracks = cPattern.trackIds.map((id): DbTrack => {
      const dbNotes = trackMap[id].sequence
        .map((on, sixteenth) => {
          return {on, sixteenth};
        })
        .filter(({on}) => on)
        .map((item) => sequenceToNote(item.sixteenth, timeSignature[0]));
      const noteIds = Array(dbNotes.length).fill(null).map((_, i) => i);
      return {
        instrumentId: trackMap[id].instrumentId,
        notes: zipObject(noteIds, dbNotes),
      }
    });
    const tracks = zipObject(cPattern.trackIds, dbTracks);
    return {
      name: cPattern.name,
      tracks,
    }
  });
  return zipObject(ids, dbPatterns)
}

function audioStoreToDbSong(store: AudioStore): DbSong {
  if (!store.song.timeSignature) throw Error("No timesignature");

  return {
    name: store.song.name,
    instruments: instrumentMapToDbInstruments(store.instrumentMap),
    bpm: store.song.bpm,
    timeSignature: {
      top: store.song.timeSignature[0],
      bottom: store.song.timeSignature[1],
    },
    patterns: patternMapToDbPatterns(store.song.timeSignature, store.trackMap, store.patternMap),
    sheet: {},
  }
}

const defaultDbSong: DbSong = {
  name: "New Song",
  bpm: 120,
  timeSignature: {top: 4, bottom: 4},
  instruments: {
    '1': {
      name: 'kick',
      url: 'kick(2).wav',
    },
    '2': {
      name: 'clap',
      url: 'clap.wav',
    },
    '3': {
      name: 'snare',
      url: 'snare.wav',
    },
    '4': {
      name: 'tom',
      url: 'tom.wav',
    },
  },
  patterns: {
    '1': {
      name: 'drums',
      tracks: {
        '1': {
          instrumentId: '1',
          notes: {
            '1': {
              startTime: {
                beat: 0,
                sixteenth: 0,
              },
              length: 0.1,
            }
          },
        },
        '2': {
          instrumentId: '2',
          notes: {
            '1': {
              startTime: {
                beat: 1,
                sixteenth: 0,
              },
              length: 0.1,
            }
          },
        },
        '3': {
          instrumentId: '3',
          notes: {
            '1': {
              startTime: {
                beat: 0,
                sixteenth: 2,
              },
              length: 0.1,
            }
          },
        },
        '4': {
          instrumentId: '4',
          notes: {
            '1': {
              startTime: {
                beat: 3,
                sixteenth: 2,
              },
              length: 0.1,
            }
          },
        },
      },
    },
  },
  sheet: {},
}

function dbSongToSong(dbSong: DbSong, id: string): ApiSong {
  log.debug({ dbSong })
  const instruments = util.fbMapToIdArr(dbSong.instruments);
  const patternsNoTracks = util.fbMapToIdArr(dbSong.patterns)
  const patterns = patternsNoTracks.map(p => {
    return {
      ...p,
      tracks: util.fbMapToIdArr(p.tracks).map(t => {
        return {
          ...t,
          sequence: util.fbMapToIdArr(t.notes || []).map(n => ({
            ...n,
            startTime: [n.startTime.beat, n.startTime.sixteenth] as [number, number],
          })),
        }
      }),
    }
  });
  return {
    id,
    name: dbSong.name,
    bpm: dbSong.bpm,
    timeSignature: [dbSong.timeSignature.top, dbSong.timeSignature.bottom],
    instruments,
    patterns,
    sheet: {},
  }
}

export default {
  async get(songId: string): Promise<ApiSong | null> {
    const db = getDatabase();
    const songRef = ref(db, `songs/${songId}`);
    const snapshot = await get(songRef);
    const val = snapshot.val() as DbSong;
    if (!val) {
      return null;
    }
    return dbSongToSong(val, songId);
  },

  async create(groupId: string, userId: string): Promise<ApiSong> {
    const db = getDatabase();

    // Get a key for a new Group.
    const newSongKey = push(child(ref(db), 'songs')).key;
    if (!newSongKey) {
      log.warn(`No key for new song being generated by Firebase`);
      throw Error();
    }
    const turnMode: TurnModeState = {
      activeUserId: userId,
      songId: newSongKey,
    };

    const updates = {} as Record<string, any>;
    updates[`/songs/${newSongKey}`] = defaultDbSong;
    updates[`/groups/${groupId}/turnMode`] = turnMode;

    await update(ref(db), updates)
      .catch(fbErr => {
        log.error(fbErr);
        const e: SongApiError = {
          description: "Error with Firebase",
          code: "unknown",
        };
        throw e;
      });
    return dbSongToSong(defaultDbSong, newSongKey);
  },

  async update(store: AudioStore, nextUserId: string, groupId: string): Promise<void> {
    const db = getDatabase();

    const turnMode: TurnModeState = {
      activeUserId: nextUserId,
      songId: store.song.id,
    };

    const updates = {} as Record<string, any>;
    updates[`/songs/${store.song.id}`] = audioStoreToDbSong(store);
    updates[`/groups/${groupId}/turnMode`] = turnMode;

    await update(ref(db), updates)
      .catch(fbErr => {
        log.error(fbErr);
        const e: SongApiError = {
          description: "Error with Firebase",
          code: "unknown",
        };
        throw e;
      });
  },

  subscribeToSongUpdate(songId: string, callback: (song: ApiSong) => void): void {
    const db = getDatabase();
    const songRef = ref(db, `songs/${songId}`);
    onValue(songRef, (snapshot) => {
      const dbSong = snapshot.val() as DbSong;
      callback(dbSongToSong(dbSong, songId));
    });
  },

  async addInstrument(songId: string, path: string, name: string): Promise<void> {
    const url = await sampleApi.getSampleUrl(path);
    const db = getDatabase();
    const instrument: DbInstrument = {
      name,
      url,
    };

    const patternsRef = ref(db, `songs/${songId}/patterns`);
    const patterns = await get(patternsRef);

    // Add new instrument to song
    const newInstrumentKey = push(child(ref(db), `songs/${songId}/instruments`)).key;
    const updates = {
      [`songs/${songId}/instruments/${newInstrumentKey}`]: instrument,
    } as any;
    // Ensure we are also adding the instrumnet to every pattern
    patterns.forEach(p => {
      const newTrack = { instrumentId: newInstrumentKey, notes: {} }
      const newTrackKey = push(child(ref(db), `songs/${songId}/patterns/${p.key}/tracks`)).key;
      updates[`songs/${songId}/patterns/${p.key}/tracks/${newTrackKey}`] = newTrack; 
    })

    await update(ref(db), updates)
      .catch(fbErr => {
        log.error(fbErr);
        const e: SongApiError = {
          description: "Error with Firebase",
          code: "unknown",
        };
        throw e;
      });
  },

  uploadSample(name: string, file: File): Promise<void> {
    log.warn("Not implemented!");
    if (!(file.name && file.size)) {
      log.error(`Not a valid file. Name: ${file.name}, Size: ${file.size}.`);
      return Promise.reject();
    }

    return Promise.resolve();
  },

  async updateSequence(songId: string, patternId: string, trackId: string, sequenceId: string, startTime: ApiBeatsSixteenths, length: number): Promise<void> {
    const db = getDatabase();
    const data = {
      startTime: {
        beat: startTime[0],
        sixteenth: startTime[1],
      },
      length,
    };
    const updates = {
      [`/songs/${songId}/patterns/${patternId}/tracks/${trackId}/notes/${sequenceId}`]: data,
    };
    await update(ref(db), updates)
      .catch(fbErr => {
        log.error(fbErr);
        const e: SongApiError = {
          description: "Error with Firebase",
          code: "unknown",
        };
        throw e;
      });
  },
}

