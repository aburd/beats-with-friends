import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail} from "firebase/auth";
import log from "loglevel";

export type AuthErrorCode =
  "wrong_password" |
  "invalid_email" |
  "invalid_email_or_password" |
  "reset_password_failure" |
  "user_creation_failure" |
  "beat_user_creation_failure" |
  "sign_out_failure" |
  "google_signin_error" |
  "unknown";

export interface AuthError {
  description: string;
  code: AuthErrorCode;
}

function firebaseCodeToAuthError(code: string): AuthError {
  switch (code) {
    case "auth/wrong-password": {
      return {
        description: "Error signing in",
        code: "wrong_password",
      }
    }
    case "auth/invalid-email": {
      return {
        description: "Error signing in",
        code: "invalid_email",
      }
    }
    case "auth/internal-error": {
      return {
        description: "Error signing in",
        code: "invalid_email_or_password",
      }
    }
    default: {
      return {
        description: "Error in authorization",
        code: "unknown",
      }
    }
  }
}

export default {
  signIn(email: string, password: string): Promise<User> {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        return userCredential.user;
      })
      .catch((error) => {
        log.debug(JSON.stringify(error));
        throw firebaseCodeToAuthError(error.code);
      });
  },
  signInGoogle(): Promise<User | null> {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    return signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) {
          log.warn(`No credential. Possible error with firebase.`);
          log.trace();
          return null;
        }
        // const token = credential.accessToken;

        // The signed-in user info.
        return result.user;
      })
      .catch((error) => {
        log.debug('Google error', JSON.stringify(error));
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        log.debug(credential);
        log.debug('Google credential', JSON.stringify(credential));
        const e: AuthError = {code: "google_signin_error", description: "Could not reset user's password"};
        throw e;
      });
  },
  signOut(): Promise<void> {
    const auth = getAuth();
    return signOut(auth)
      .catch((error) => {
        log.debug(JSON.stringify(error));
        const e: AuthError = {code: "sign_out_failure", description: "Could not reset user's password"};
        throw e;
      });
  },
  create(email: string, password: string): Promise<User> {
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        return userCredential.user;
      })
      .catch((error) => {
        log.debug(JSON.stringify(error));
        const e: AuthError = {code: "user_creation_failure", description: "Could not create user"};
        throw e;
      });
  },
  update(email: string): Promise<void> {
    log.warn("Not implemented!");
    return Promise.resolve();
  },
  delete(email: string, password: string): Promise<void> {
    log.warn("Auth delete not implemented!");
    return Promise.resolve();
  },
  resetPassword(email: string): Promise<void> {
    const auth = getAuth();
    return sendPasswordResetEmail(auth, email)
      .catch((error) => {
        log.debug(JSON.stringify(error));
        const e: AuthError = {code: "reset_password_failure", description: "Could not reset user's password"};
        throw e;
      });
  },
}
