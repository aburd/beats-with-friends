import {User} from "../types";
import log from "loglevel";

const userFromServer: User = {
  id: '1',
  name: 'Richard D. James',
}

export default {
  get(userId: string): Promise<User> {
    log.warn("Not implemented!");
    if (userId === '1') {
      return Promise.resolve(userFromServer);
    }
    return Promise.reject();
  }
}
