import auth, { AuthErrorCode } from './auth';
import group from './group';
import song from './song';
import user, { UserApiErrorCode } from './user';

export type BaseApiErrorCode = "unknown";
export type BaseApiError = {
  description: string;
  code: BaseApiErrorCode;
};
export type ErrorCode = 
  BaseApiErrorCode | 
  AuthErrorCode | 
  UserApiErrorCode;

export {
  auth,
  group,
  song,
  user,
}
