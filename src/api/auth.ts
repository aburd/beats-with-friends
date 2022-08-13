import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import log from "loglevel";

export default {
  signIn(email: string, password: string): Promise<User> {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        return userCredential.user;
      })
      .catch((error) => {
        log.error("Firebase error:", error);
        throw Error(`Error trying to sign in`);
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

        const token = credential.accessToken;
        // The signed-in user info.
        return result.user;
      }).catch((error) => {
        log.error(error);
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        log.error(credential);
        throw Error(`Error logging with google.`);
      });
  },
  signOut(): Promise<void> {
    const auth = getAuth();
    return signOut(auth)
      .catch((error) => {
        log.error("Firebase error:", error);
        throw Error(`Error trying to sign out`);
      });
  },
  create(email: string, password: string): Promise<User> {
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        return user;
      })
      .catch((error) => {
        log.error("Firebase error:", error);
        throw Error(`Error trying to create a user`);
      });
  }
}
