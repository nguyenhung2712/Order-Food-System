import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// Initialize Firebase
const app = firebase.initializeApp({
  apiKey: 'AIzaSyAGqLWawf6MavkKCacJAIkcT94D3hJlEgw',
  authDomain: 'react-chat-test-d4d3b.firebaseapp.com',
  databaseURL:
    'https://react-chat-test-d4d3b-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'react-chat-test-d4d3b',
  storageBucket: 'react-chat-test-d4d3b.appspot.com',
  messagingSenderId: '397423367502',
  appId: '1:397423367502:web:0d46fbe9834913bbd73a1f',
});

export default firebase;

export const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    /* firebase.auth.FacebookAuthProvider.PROVIDER_ID */
  ],
  /* callbacks: {
        Avoid redirects after sign-in.
        signInSuccessWithAuthResult: () => false,
    }, */
};

// Firebase storage reference
export const storage = getStorage(app);
export const db = getFirestore(app);
