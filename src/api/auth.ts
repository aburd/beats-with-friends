import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User} from "firebase/auth";
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
        log.trace('user', user);
        return user;
      })
      .catch((error) => {
        log.error("Firebase error:", error);
        throw Error(`Error trying to create a user`);
      });
  }
}
