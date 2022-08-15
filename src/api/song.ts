import {Song, Note} from '../audio/types';
import log from "loglevel";

export let songFromServer: Song = {
  id: '1',
  name: 'Beat 1',
  // TODO: should probably move this to patterns to allow each pattern to have its own timeSignature 
  timeSignature: [4, 4],
  instruments: [
    {
      id: '1',
      name: 'kick',
      url: 'kick(2).wav',
    },
    {
      id: '2',
      name: 'clap',
      url: 'clap.wav',
    }
  ],
  patterns: [
    {
      id: '1',
      name: 'drums',
      tracks: [
        {
          id: '1',
          instrumentId: '1',
          sequence: [
            {startTime: [0, 0], length: 0.1},
            {startTime: [1, 0], length: 0.1},
            {startTime: [2, 0], length: 0.1},
            {startTime: [3, 0], length: 0.1},
            {startTime: [3, 2], length: 0.1},
          ],
        },
        {
          id: '2',
          instrumentId: '2',
          sequence: [
            {startTime: [1, 0], length: 0.1},
            {startTime: [3, 0], length: 0.1},
          ],
        }
      ],
    },
  ],
  sheet: {},
};

export default {
  get(songId: string): Promise<Song> {
    log.warn("Not implemented!");
    if (songId === '1') {
      return Promise.resolve(songFromServer);
    }
    return Promise.reject();
  },
  update(song: Song): Promise<void> {
    log.warn("Not implemented!");
    songFromServer = song;
    if (song.id === '1') {
      return Promise.resolve();
    }
    return Promise.reject();
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
  updateSequence(songId: string, patternId: string, instrumentId: string, note: Note): Promise<void> {
    log.warn("Not implemented!");
    return Promise.resolve();
  },
}

