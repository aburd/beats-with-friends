import {Group, TurnModeState} from '../types';
import { Song } from '../audio';
import { songFromServer } from './song';
import log from "loglevel";

const groupFromServer: Group = {
  id: '1',
  name: 'Beat Boyz',
  users: [{id: '1', name: 'Richard D. James', groupIds: ['1']}, {id: '2', name: 'Tom Jenkinson', groupIds: ['1']}],
};

const turnModeFromServer: TurnModeState = {
  activeUserId: '1',
  songId: '1',
};

export default {
  get(groupId: string): Promise<Group> {
    log.warn("Not implemented!");
    if (groupId !== '1') Promise.reject('Group does not exist');
    return Promise.resolve(groupFromServer);
  },
  index(userId: string): Promise<Group[]> {
    return Promise.resolve([groupFromServer]);
  },
  getTurnMode(groupId: string): Promise<TurnModeState> {
    const url = `/v1/api/groups/${groupId}/turn`;
    if (groupId === '1') {
      return Promise.resolve(turnModeFromServer);
    }
    return Promise.reject();
  },
  addUser(groupId: string, userId: string): Promise<Group> {
    log.warn("Not implemented!");
    if (groupId !== '1') Promise.reject('Group does not exist');
    
    const newGroup = { ...groupFromServer };
    newGroup.users.push({ id: userId, name: 'New User', groupIds: [groupId] });
    return Promise.resolve(newGroup);
  },
  removeUser(groupId: string, userId: string): Promise<Group> {
    log.warn("Not implemented!");
    if (groupId !== '1') Promise.reject('Group does not exist');

    const newGroup = { ...groupFromServer };
    newGroup.users = newGroup.users.filter(u => u.id === userId);
    return Promise.resolve(newGroup);
  },
  createBeat(groupId: string): Promise<[Group, Song]> {
    log.warn("Not implemented!");
    if (groupId !== '1') Promise.reject('Group does not exist');

    return Promise.resolve([groupFromServer, songFromServer]);
  }
}
