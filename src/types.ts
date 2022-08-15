export type TurnModeState = {
  activeUserId: string;
  songId: string;
}

export type Group = {
  id: string;
  name: string;
  users: User[];
  turnMode?: TurnModeState;
}

export type GroupSimple = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  groupIds: string[],
}
