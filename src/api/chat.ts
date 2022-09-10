import { getDatabase, ref, update, push, child, get, serverTimestamp } from "firebase/database";
import log from "loglevel";
import * as util from './util'
import { Message, Chat, MessageParams } from '../types';

export type ChatApiError = "chat_db_failure"

export interface DbChat { 
  id?: string,
  messages?: Record<string, Message>
}

export default {
  async get(chatId: string): Promise<Chat | null> {
    const db = getDatabase()
    const chatRef = ref(db, `chats/${chatId}`);
    const snapshot = await get(chatRef);
    const val = snapshot.val() as DbChat;
    console.log(val);
    
    if (!val) return null
    // if(!val.id) return null
    // const chat: Chat = { chatId: val.id }
    // WHEN THERE IS NO MESSAGE, RETURN CHATID ONLY
    const chat: Chat = { chatId: ''}
    if (!val.messages) return chat
    chat.messages = util.fbMapToIdArr(val.messages)

    return chat
  },

  async create(chatId: string): Promise<Chat> {
    const db = getDatabase()
    const updates = {} as Record<string, any>
    const chatData: DbChat = {
      id: chatId
    }

    updates[`/chats/${chatId}`] = chatData

    await update(ref(db), updates).catch(fbErr => {
      log.error(fbErr);
      const e: any = {
        description: "Error with Firebase",
        code: "chat_db_failure",
      };
      throw e;
    });
  
    return {
      chatId
    }
  },

  async addMessage({ chatId, text, photoURL, email, name, id }: MessageParams): Promise<Message> {
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
    const newMessageKey = push(child(ref(db), `chats/${chatId}/messages`)).key;

    updates[`chats/${chatId}/messages/${newMessageKey}`] = messageData

    await update(ref(db), updates).catch((fbErr) => {
      log.error(fbErr);
      const e: any = {
        description: "Error with Firebase",
        code: "chat_db_failure",
      };
      throw e;
    });
    return messageData
  }
}