export type TurnModeState = {
  activeUserId: string;
  songId: string;
}

export type Group = {
  id: string;
  name: string;
  users: User[];
  turnMode?: TurnModeState;
  chat?: Chat
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

export type Message = { 
  createdAt: any
  photoURL: string
  text: string
  id: string
  name: string
  email: string
}

export type Chat = { 
  groupId: string
  messages?: Message[]
}