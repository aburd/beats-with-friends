import {orderByValue, getDatabase, ref, set, update, push, child, get} from "firebase/database";
import log from "loglevel";
import {User} from "../types";
import authApi from "./auth";
import * as util from "./util";

export type UserApiErrorCode = "beats_user_creation_failure";
export interface UserApiError {
  description: string;
  code: UserApiErrorCode;
}

type DbUser = {
  name: string;
  email: string;
  groupIds: Record<string, boolean>;
}

const api = {
  async get(userId: string): Promise<User | null> {
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);
    const val = snapshot.val() as DbUser;
    if (!val) {
      return null;
    }

    return {
      id: userId,
      email: userId,
      name: val.name,
      groupIds: Object.keys(val.groupIds || {}),
    }
  },
  async getByEmail(email: string): Promise<User | null> {
    // TODO: I hate this, this really should be on a server
    const db = getDatabase();
    const usersRef = ref(db, `users`);
    const snapshot = await get(usersRef);
    const val = snapshot.val() as Record<string, DbUser>;
    for (const [id, dbUser] of Object.entries(val)) {
      if (dbUser.email === email) {
        return {
          id,
          email: dbUser.email,
          name: dbUser.name,
          groupIds: Object.keys(dbUser.groupIds),
        }
      }
    }

    return null;
  },
  async create(email: string, password: string, name: string, groupIds: string[]): Promise<User> {
    const fbUser = await authApi.create(email, password);
    if (!fbUser.email) {
      const err: UserApiError = {
        description: "Can't create user without an email",
        code: "beats_user_creation_failure",
      }
      throw err;
    }
    return api.createWithId(fbUser.uid, fbUser.email || "", name, groupIds);
  },
  async createWithId(id: string, email: string, name: string, groupIds: string[]): Promise<User> {
    const db = getDatabase();
    log.debug(util.idArrToFbMap(groupIds));
    const dbUser = {
      name,
      groupIds: util.idArrToFbMap(groupIds),
    };
    await update(ref(db), {[`/users/${id}`]: dbUser})
      .catch(_e => {
        const err: UserApiError = {
          description: "Error writing to DB",
          code: "beats_user_creation_failure",
        }
        throw err;
      });
    return {id, email, name, groupIds};
  }
}

export default api;
