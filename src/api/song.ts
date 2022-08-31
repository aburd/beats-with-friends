import {onValue, getDatabase, ref, set, update, push, child, get} from "firebase/database";
import log from "loglevel";
import {TurnModeState} from "../types";
import {Song, Note, BeatsSixteenths, TimeSignature} from '../audio/types';
import * as util from "./util";
import {AudioStore} from "../audio/store";
import {ClientInstrument} from "../audio/instruments";
import {zipObject} from "lodash";
import {ClientPattern} from "../audio/patterns";
import {ClientTrack} from "../audio/tracks";

export type SongApiErrorCode =
  "unknown";
export type SongApiError = {
  description: string;
  code: SongApiErrorCode;
}

type DbNote = {
  startTime: {
    beat: number;
    sixteenth: number;
  },
  length: number;
};

type DbTrack = {
  instrumentId: string;
  notes: Record<string, DbNote>;
};

type DbPattern = {
  name: string;
  tracks: Record<string, DbTrack>;
}

type DbInstrument = {
  name: string;
  url: string;
};

export type DbSong = {
  name: string;
  timeSignature: {
    top: number;
    bottom: number;
  },
  instruments: Record<string, DbInstrument>,
  patterns: Record<string, DbPattern>,
  sheet: Record<string, boolean>,
};

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

function patternMapToDbPatterns(timeSignature: TimeSignature, trackMap: Record<string, ClientTrack>, patternMap: Record<string, ClientPattern>): Record<string, DbPattern> {
  const ids = Object.keys(patternMap);
  const cPatterns = Object.values(patternMap);
  const dbPatterns = cPatterns.map((cPattern): DbPattern => {
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
  if (!store.timeSignature) throw Error("No timesignature");

  return {
    name: store.songName,
    instruments: instrumentMapToDbInstruments(store.instrumentMap),
    timeSignature: {
      top: store.timeSignature[0],
      bottom: store?.timeSignature[1],
    },
    patterns: patternMapToDbPatterns(store.timeSignature, store.trackMap, store.patternMap),
    sheet: {},
  }
}

const defaultDbSong: DbSong = {
  name: "New Song",
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

function dbSongToSong(dbSong: DbSong, id: string): Song {
  const instruments = util.fbMapToIdArr(dbSong.instruments);
  const patternsNoTracks = util.fbMapToIdArr(dbSong.patterns)
  const patterns = patternsNoTracks.map(p => {
    return {
      ...p,
      tracks: util.fbMapToIdArr(p.tracks).map(t => {
        return {
          ...t,
          sequence: util.fbMapToIdArr(t.notes).map(n => ({
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
    timeSignature: [dbSong.timeSignature.top, dbSong.timeSignature.bottom],
    instruments,
    patterns,
    sheet: {},
  }
}

export default {
  async get(songId: string): Promise<Song | null> {
    const db = getDatabase();
    const songRef = ref(db, `songs/${songId}`);
    const snapshot = await get(songRef);
    const val = snapshot.val() as DbSong;
    if (!val) {
      return null;
    }
    return dbSongToSong(val, songId);
  },
  async create(groupId: string, userId: string): Promise<Song> {
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
  // TODO: Make this more generic
  async update(store: AudioStore, songId: string, nextUserId: string, groupId: string): Promise<Song> {
    const db = getDatabase();

    const turnMode: TurnModeState = {
      activeUserId: nextUserId,
      songId,
    };

    const updates = {} as Record<string, any>;
    updates[`/songs/${songId}`] = audioStoreToDbSong(store);
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
    return dbSongToSong(defaultDbSong, songId);
  },
  subscribeToSongUpdate(songId: string, callback: (song: Song) => void): void {
    const db = getDatabase();
    const songRef = ref(db, `songs/${songId}`);
    onValue(songRef, (snapshot) => {
      const dbSong = snapshot.val() as DbSong;
      callback(dbSongToSong(dbSong, songId));
    });
  },
  addInstrument(songId: string, instrumentId: string): Promise<void> {
    log.warn("Not implemented!");
    return Promise.resolve();
  },
  addSample(name: string, file: File): Promise<void> {
    log.warn("Not implemented!");
    if (!(file.name && file.size)) {
      log.error(`Not a valid file. Name: ${file.name}, Size: ${file.size}.`);
      return Promise.reject();
    }

    return Promise.resolve();
  },
  async updateSequence(songId: string, patternId: string, trackId: string, sequenceId: string, startTime: BeatsSixteenths, length: number): Promise<void> {
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
    await update(ref(db), update)
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

