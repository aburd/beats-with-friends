import log from "loglevel";
import { ErrorCode } from "./api";

/**
 * API error codes to human-readable strings
 */
export function errorMsg(errorCode: ErrorCode) {
  const unknownErrMsg = "An unknown error occured. Sorry beat maker..."; 

  switch(errorCode) {
    case "invalid_email": {
      return "The e-mail address used to sign in is invalid."
    }
    // We know this error is unknown
    case "unknown": {
      return unknownErrMsg; 
    }
    // We don't even know what this is, something is wrong, log it
    default: {
      log.warn(`An unreachable branch has been hit. Usage of the errorMsg with errorCode [${errorCode}].`);
      log.trace();
      return unknownErrMsg;
    }
  }
}
