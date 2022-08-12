import {Group, TurnModeState} from '../types';

const groupFromServer: Group = {
  id: '1',
  name: 'Beat Boyz',
  users: [{id: '1', name: 'Richard D. James'}, {id: '2', name: 'Tom Jenkinson'}],
  songIds: ['1'],
};

const turnModeFromServer: TurnModeState = {
  group: groupFromServer,
  activeUserId: '1',
  songId: '1',
};

export default {
  get(_groupId: string): Promise<Group> {
    return Promise.resolve(groupFromServer);
  },
  getTurnMode(groupId: string): Promise<TurnModeState> {
    const url = `/v1/api/groups/${groupId}/turn`;
    if (groupId === '1') {
      return Promise.resolve(turnModeFromServer);
    }
    return Promise.reject();
  }
}
