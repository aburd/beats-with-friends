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

export type Message = { 
  createdAt: any
  photoURL: string | null
  text: string
  id: string
  name: string
  email: string
}

export interface MessageParams extends Omit<Message, 'createdAt'> {
  chatId: string
}

export type Chat = { 
  chatId: string
  messages?: Message[]
}