import {User} from "../types";

const userFromServer: User = {
  id: '1',
  name: 'Richard D. James',
}

export default {
  get(userId: string): Promise<User> {
    if (userId === '1') {
      return Promise.resolve(userFromServer);
    }
    return Promise.reject();
  }
}
