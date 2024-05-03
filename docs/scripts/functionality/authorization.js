import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, deleteUser,
  sendEmailVerification, onAuthStateChanged, signOut, sendPasswordResetEmail  } from "firebase/auth";
import { getFirestore, doc, setDoc, deleteDoc, query, where, getDocs, collection, addDoc } from "firebase/firestore";

// Initialize Firebase
const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
});

const auth = getAuth(app);
const db = getFirestore(app);

async function isUniqueUsername(username) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty; // returns true if no documents match
}

export async function isEmailRegistered(email) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty; // returns true if no email match
}

export async function registerUser(email, username, password) {
  // First check if the username is unique
  if (!await isUniqueUsername(username)) {
    console.log("Registration failed: Username is already in use.");
    return { success: false, message: "Username is already in use." };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Firebase Auth user created successfully with UID:", user.uid);

    await updateProfile(user, {
      displayName: username
    });

    // Store additional user information in Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email
    });

    console.log("User data stored in Firestore successfully.");
    await sendVerificationEmail(user);
    return { success: true };
  } catch (error) {
    console.log("Registration failed:", error.code, error.message);
    return { success: false, message: error.message };
  }
}

export async function signIn(emailOrUsername, password) {
  const isEmail = isValidEmail(emailOrUsername);
  const field = isEmail ? "email" : "username";
  const usersRef = collection(db, "users");
  const q = query(usersRef, where(field, "==", emailOrUsername));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return { success: false, root: field, message: 'not found' };
  } else {
    const email = querySnapshot.docs[0].data().email;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      sessionStorage.setItem('user', JSON.stringify(userCredential.user));
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, root: 'password', message: error.message };
    }
  }
}

export async function unAuthenticate() {
  const auth = getAuth();  // Get the Firebase auth instance
  try {
    await signOut (auth);  // Sign out from Firebase
    console.log("User signed out successfully.");
  } catch (error) {
    console.error("Error signing out:", error);
  }
  sessionStorage.removeItem('user');  // Clear user session data
  await loadComponent({
    containerId: 'content',
    html: home_html,
    css: home_css,
    init: home_init
  });
}

export async function deleteUserAccount() {
  const userAuth = getAuth().currentUser;
  if (!userAuth) {
    console.log("No authenticated user found.");
    return;
  }

  try {
    // Delete user from Firebase Authentication
    await deleteUser(userAuth);
   
    // Delete user data from Firestore
    await deleteUserData(userAuth.uid);

    console.log("Account deleted successfully.");

    // Clear user data
    await unAuthenticate();
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    await loadComponent({
      containerId: 'content',
      html: home_html,
      css: home_css,
      init: home_init
    });
  } catch (error) {
    console.log("Failed to delete user account:", error);
    console.log("Failed to delete account. Please try again.");
  }
}

async function deleteUserData(userId) {
  const userDoc = doc(db, "users", userId);
  try {
    await deleteDoc(userDoc);
  } catch (error) {
    console.log(`Failed to delete user data for UID ${userId}: ${error.message}`);
  }
}

export async function sendVerificationEmail(user) {
  await sendEmailVerification(user);
}

export function refreshUser() {
  const auth = getAuth();
  if (auth) {
    try {
      onAuthStateChanged(auth, user => {
        if (user) {
          // Serialize the entire user object including providerData
          sessionStorage.setItem('user', JSON.stringify(user.toJSON()));  // Using toJSON() to ensure complete serialization
          console.log("User data refreshed from Firebase Auth.");
        } else {
          console.log("No user is currently logged in.");
          sessionStorage.removeItem('user');
        }
      });
    } catch (error) {
      console.log("Error at refreshUser(): ", error);
    }
  }  
}

export async function resendEmailVerification() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.log("No authenticated user found");
  }

  if (!user.emailVerified) {
    return sendEmailVerification(user)
      .then(() => console.log('Verification email sent successfully.'))
      .catch(error => {
        console.log('Failed to resend verification email: ' + error.message);
      });
  } else {
    console.log("Email already verified");
  }
}

export async function sendResetPasswordEmail(email) {
  const auth = getAuth();
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent successfully.');
  } catch (error) {
    console.log("Error sending password reset email:", error);
  }
}

export async function saveStory(userId, story) {  
  const storiesRef = collection(db, "users", userId, "stories");
  try {
    await addDoc(storiesRef, {
      title: story.title,
      content: story.content
    });
    console.log("Story saved successfully!");
  } catch (error) {
    console.log("Failed to save story:", error);
  }
}

export async function fetchStories(userId) {
  const storiesRef = collection(db, "users", userId, "stories");
  const querySnapshot = await getDocs(storiesRef);
  return querySnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
      content: doc.data().content
  }));
}
