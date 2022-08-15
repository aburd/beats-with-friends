import log from "loglevel";
import { ErrorCode } from "./api";

// Utilize TS to ensure I have human readable matches for all errors
const knownErrorMsgs: Record<ErrorCode, string> = {
  google_signin_error: "There was an issue signing in with Google. Perhaps Google's services aren't running at the moment. Please try again later or try creating an e-mail account.",
  sign_out_failure: "There was an error signing your user out. If this is a serious issue, please contact aaron.burdick@protonmail.com",
  wrong_password: "The password used to sign in is incorrect.",
  invalid_email: "The e-mail address used to sign in is invalid.",
  invalid_email_or_password: "Please check your e-mail address or password used to sign in.",
  reset_password_failure: "There was an error resetting your password. Please contact aaron.burdick@protonmail.com",
  user_creation_failure: "There was an error creating your user, are you sure your e-mail address is valid?",
  unknown: "An unknown error occured. Sorry beat maker...",
};

/**
 * API error codes to human-readable strings
 */
export function errorMsg(errorCode: ErrorCode) {
  const msg = knownErrorMsgs[errorCode];
  if (!msg) {
    log.warn(`An unreachable branch has been hit. Usage of the errorMsg with errorCode [${errorCode}].`);
    log.trace();
    return knownErrorMsgs.unknown;
  }
  return msg;
}


