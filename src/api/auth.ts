import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth";

export default {
  signIn(email: string, password: string) {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
        return user
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  },
  create(email: string, password: string) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        log.trace('user', user);
      })
      .catch((error) => {
        console.error(error);
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }
}
