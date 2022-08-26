import auth, { AuthErrorCode } from './auth';
import group, { GroupApiErrorCode } from './group';
import song, { SongApiErrorCode } from './song';
import user, { UserApiErrorCode } from './user';
import chat from './chat';

export type BaseApiErrorCode = "unknown";
export type ErrorCode = 
  BaseApiErrorCode | 
  AuthErrorCode | 
  GroupApiErrorCode | 
  SongApiErrorCode | 
  UserApiErrorCode;

export type ApiError = {
  description: string;
  code: ErrorCode;
};

export {
  auth,
  group,
  song,
  user,
  chat,
}
