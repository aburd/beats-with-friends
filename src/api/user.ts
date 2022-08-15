import {getDatabase, ref, set, update, push, child, get} from "firebase/database";
import {User} from "../types";
import authApi from "./auth";
import log from "loglevel";
import {zipObject} from "lodash";

export type UserApiErrorCode = "beats_user_creation_failure";
export interface UserApiError {
  description: string;
  code: UserApiErrorCode;
}

type DbUser = {
  name: string;
  groupIds: Record<string, boolean>;
}

const userFromServer: User = {
  id: '1',
  name: 'Richard D. James',
  groupIds: [],
}

function idArrToFbMap(idArr: string[]) {
  const vals = idArr.map(() => true);
  return zipObject(idArr, vals);
}

const api = {
  async get(userId: string): Promise<User | null> {
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);
    const val = snapshot.val();
    if (!val) {
      return null;
    }

    return {
      id: userId,
      name: val.name,
      groupIds: Object.keys(val.groupIds),
    }
  },
  async create(email: string, password: string, name: string, groupIds: string[]): Promise<User> {
    const fbUser = await authApi.create(email, password);
    return api.createWithId(fbUser.uid, name, groupIds);
  },
  async createWithId(id: string, name: string, groupIds: string[]): Promise<User> {
    const db = getDatabase();
    log.debug(idArrToFbMap(groupIds));
    const dbUser = {
      name,
      groupIds: idArrToFbMap(groupIds),
    };
    await update(ref(db), {[`/users/${id}`]: dbUser})
      .catch(e => {
        const err: UserApiError = {
          description: "Error writing to DB",
          code: "beats_user_creation_failure",
        }
        throw err;
      });
    return {id, name, groupIds};
  }
}

export default api;
