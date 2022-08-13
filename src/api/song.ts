import {Song} from '../audio/types';

const songFromServer: Song = {
  id: '1',
  name: 'Beat 1',
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
    if ('1') {
      return Promise.resolve(songFromServer);
    }
    return Promise.reject();
  }
}
