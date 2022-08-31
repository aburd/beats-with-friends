import auth, { AuthErrorCode } from './auth';
import group, { GroupApiErrorCode } from './group';
import samples from './samples';
import song, { SongApiErrorCode } from './song';
import user, { UserApiErrorCode } from './user';

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
  samples,
  song,
  user,
}
