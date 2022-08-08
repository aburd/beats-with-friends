import { Song } from '../audio/types';

const songFromServer: Song = {
  name: 'Beat 1',
  instruments: {
    1: {
      name: 'Foo Instrument',
    }, 
  },
  patterns: {
    1: {
      name: 'foo',
      bars: [{
        instrumentId: 1,
        sequence: [
          // {startTime: [0, 0], length: 0.1},
          // {startTime: [1, 0], length: 0.1},
          // {startTime: [2, 0], length: 0.1},
          // {startTime: [3, 0], length: 0.1},
          // {startTime: [3, 2], length: 0.1},
        ],
      }],
    },
  },
  sheet: {},
};


const song = {
  get(songId: string) {
    return Promise.resolve(songFromServer);
  }
}

export default {
  song,
}
