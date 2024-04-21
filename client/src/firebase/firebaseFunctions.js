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

export async function doSocialSignIn() {
  try {
    let auth = getAuth();
    let socialProvider = new GoogleAuthProvider();
    let result = await signInWithPopup(auth, socialProvider);
    console.log(result);
    return result;
  } catch (error) {
    console.error("error:", error);
    throw error;
  }
}

export async function doPasswordReset(email) {
  let auth = getAuth();
  await sendPasswordResetEmail(auth, email);
}

export async function doSignOut() {
  let auth = getAuth();
  await signOut(auth);
}
