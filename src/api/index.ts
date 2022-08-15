import auth, { AuthErrorCode } from './auth';
import group from './group';
import song from './song';
import user from './user';

export type ErrorCode = AuthErrorCode;

export {
  auth,
  group,
  song,
  user,
}
