import { onValue, getDatabase, ref, set, update, push, child, get } from "firebase/database";
import log from "loglevel";
import { GroupSimple, Group, TurnModeState, User, Message } from '../types';
import usersApi from "./user";
import chatApi from './chat';
import * as util from "./util";

export type GroupApiErrorCode =
  "group_create_failure" |
  "group_add_failure_no_user" |
  "group_add_user_failure_no_group" |
  "group_index_failure_no_user" |
  "group_db_failure" |
  "unknown";
export interface GroupApiError {
  description: string;
  code: GroupApiErrorCode;
}

type DbGroup = {
  name: string;
  userIds: Record<string, boolean>;
  turnMode?: {
    activeUserId: string,
    songId: string,
  },
  chat?: {
    id: string,
    messages: Record<string, Message>
  }
};

const groupFromServer: Group = {
  id: '1',
  name: 'Beat Boyz',
  users: [{id: '1', email: 'hey@you.com', name: 'Richard D. James', groupIds: ['1']}, {id: '2', email: 'foo@bar.com', name: 'Tom Jenkinson', groupIds: ['1']}],
};

function dbGroupToGroup(dbGroup: DbGroup, groupId: string, users: User[]): Group {

  return {
    id: groupId,
    name: dbGroup.name,
    users,
    turnMode: dbGroup.turnMode,
    chat: {
      groupId,
      messages: dbGroup.chat?.messages ? util.fbMapToIdArr(dbGroup.chat?.messages) : []
    }
  }
}

export default {
  async get(groupId: string): Promise<Group | null> {
    const db = getDatabase();
    const groupRef = ref(db, `groups/${groupId}`);
    const snapshot = await get(groupRef);
    const val = snapshot.val() as DbGroup;
    if (!val) null;
    if (!val.chat) await chatApi.create(groupId);

    const userIds = Object.keys(val.userIds);  
    const users = await Promise.all(userIds.map(id => usersApi.get(id)));
  
    const messages = val?.chat?.messages ? util.fbMapToIdArr(val?.chat?.messages) : []
  
    return {
      id: groupId,
      name: val.name,
      users: users as User[],
      turnMode: val.turnMode,
      chat: {
        groupId,
        messages
      } 
    }
  },

  async subscribe(groupId: string, callback: (group: Group) => void): Promise<void> {
    const db = getDatabase();
    const groupRef = ref(db, `groups/${groupId}`);
    onValue(groupRef, async (snapshot) => {
      const dbGroup = snapshot.val() as DbGroup;
      const userIds = Object.keys(dbGroup.userIds);
      const users = await Promise.all(userIds.map(id => usersApi.get(id)));

      callback(dbGroupToGroup(dbGroup, groupId, users as User[]));
    });
  },

  async create(userIds: string[], name: string): Promise<GroupSimple> {
    const db = getDatabase();
    const groupData: DbGroup = {
      userIds: util.idArrToFbMap(userIds),
      name,
    };

    // Get a key for a new Group.
    const newGroupKey = push(child(ref(db), 'groups')).key;
    if (!newGroupKey) {
      log.warn(`No key for new group being generated by Firebase`);
      throw Error();
    }

    // Write the new group's data simultaneously in the groups list and the user's group list.
    const updates = {} as Record<string, any>;
    updates['/groups/' + newGroupKey] = groupData;
    for (const userId of userIds) {
      updates[`/users/${userId}/groupIds/${newGroupKey}`] = true;
    }

    await update(ref(db), updates)
      .catch(fbErr => {
        log.error(fbErr);
        const e: GroupApiError = {
          description: "Error with Firebase",
          code: "group_create_failure",
        };
        throw e;
      });
    return {
      id: newGroupKey,
      name: name,
    }
  },

  async index(userId: string): Promise<GroupSimple[]> {
    const user = await usersApi.get(userId);
    if (!user) {
      const e: GroupApiError = {
        description: "No user to get groups from",
        code: "group_index_failure_no_user",
      }
      throw e;
    }

    const db = getDatabase();
    const groups = await Promise.all(user.groupIds.map(async (groupId) => {
      const groupRef = ref(db, `groups/${groupId}`);
      const snapshot = await get(groupRef);
      const val = snapshot.val() as DbGroup;
      if (!val) {
        log.warn(`Something is wrong with the DB, you shouldn't have falsy values here.`);
        return null;
      }
      return {
        id: groupId,
        name: val.name,
      }
    }));

    return groups.filter(Boolean) as GroupSimple[];
  },

  async addUser(group: Group, email: string): Promise<Group> {
    const user = await usersApi.getByEmail(email);
    if (!user) {
      const e: GroupApiError = {
        description: "No user to add",
        code: "group_add_failure_no_user",
      }
      throw e;
    }

    const db = getDatabase();
    const updates = {} as Record<string, any>;
    updates[`/groups/${group.id}/userIds/${user.id}`] = true;
    updates[`/users/${user.id}/groupIds/${group.id}`] = true;

    await update(ref(db), updates)
      .catch(fbErr => {
        log.error(fbErr);
        const e: GroupApiError = {
          description: "Error with Firebase",
          code: "group_db_failure",
        };
        throw e;
      });

    return {
      ...group,
      users: [...group.users, user],
    }
  },

  removeUser(groupId: string, userId: string): Promise<Group> {
    log.warn("Not implemented!");
    if (groupId !== '1') Promise.reject('Group does not exist');

    const newGroup = {...groupFromServer};
    newGroup.users = newGroup.users.filter(u => u.email === userId);
    return Promise.resolve(newGroup);
  },
}
