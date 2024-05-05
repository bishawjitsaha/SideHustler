import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithEmailAndPassword,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import axios from "axios";

export async function doCreateUserWithEmailAndPassword(
  email,
  password,
  displayName
) {
  const auth = getAuth();
  await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(auth.currentUser, { displayName: displayName });
  const idToken = await auth.currentUser.getIdToken();
  return { user: auth.currentUser, idToken: idToken };
}

export async function doUpdateUserDisplayName(newDisplayName){
  const auth = getAuth();
  const user = auth.currentUser
  if(user){
    await updateProfile(user, {displayName: newDisplayName});
    return newDisplayName;
  }
  else {
    throw new Error("No user is logged in!");
  }
}

export async function doChangePassword(email, oldPassword, newPassword) {
  const auth = getAuth();
  let credential = EmailAuthProvider.credential(email, oldPassword);
  console.log(credential);
  await reauthenticateWithCredential(auth.currentUser, credential);

  await updatePassword(auth.currentUser, newPassword);
  await doSignOut();
}

export async function doSignInWithEmailAndPassword(email, password) {
  let auth = getAuth();
  await signInWithEmailAndPassword(auth, email, password);
}

export async function doPasswordReset(email) {
  let auth = getAuth();
  await sendPasswordResetEmail(auth, email);
}

export async function doSignOut() {
  let auth = getAuth();
  await signOut(auth);
}
