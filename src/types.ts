export type TurnModeState = {
  group: Group;
  activeUserId: string;
  songId: string;
}

export type Group = {
  id: string;
  name: string;
  users: User[];
  songIds: string[];
}

export type User = {
  id: string;
  name: string;
}
