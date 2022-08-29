import { getDatabase, ref, update, push, child, get, serverTimestamp } from "firebase/database";
import log from "loglevel";
import * as util from './util'
import { Message, Chat, MessageParams } from '../types';

export interface DbChat { 
  id: string,
  messages?: Record<string, Message>
}

export default {
  async get(groupId: string): Promise<Chat | null> {
    const db = getDatabase()
    const chatRef = ref(db, `groups/${groupId}/chat`);
    const snapshot = await get(chatRef);
    const val = snapshot.val() as DbChat;
    if (!val) null
    const chat: Chat = { groupId: val.id }
    // WHEN THERE IS NO MESSAGE, RETURN GROUPID ONLY
    if (!val.messages) return chat
    chat.messages = util.fbMapToIdArr(val.messages)

    return chat
  },

  async create(groupId: string): Promise<Chat> {
    const db = getDatabase()
    const updates = {} as Record<string, any>
    const chatData: DbChat = {
      id: groupId,
    }

    updates[`/groups/${groupId}/chat`] = chatData

    await update(ref(db), updates).catch(fbErr => {
      log.error(fbErr);
      const e: any = {
        description: "Error with Firebase",
        code: "group_db_failure",
      };
      throw e;
    });
  
    return {
      groupId
    }
  },

  async addMessage({ groupId, text, photoURL, email, name, id }: MessageParams): Promise<Message> {
    const db = getDatabase()
    const updates = {} as Record<string, any>
    const messageData: Message = {
      id,
      text,
      createdAt: serverTimestamp(),
      photoURL: photoURL || null,
      email,
      name
    }
    const newMessageKey = push(child(ref(db), `groups/${groupId}/chat/messages`)).key;

    updates[`groups/${groupId}/chat/messages/${newMessageKey}`] = messageData

    await update(ref(db), updates).catch((fbErr) => {
      log.error(fbErr);
      const e: any = {
        description: "Error with Firebase",
        code: "group_db_failure",
      };
      throw e;
    });
    return messageData
  }
}