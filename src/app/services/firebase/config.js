import firebase from 'firebase/compat/app';

import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

var firebaseConfig = {
    apiKey: "AIzaSyAGqLWawf6MavkKCacJAIkcT94D3hJlEgw",
    authDomain: "react-chat-test-d4d3b.firebaseapp.com",
    databaseURL: "https://react-chat-test-d4d3b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "react-chat-test-d4d3b",
    storageBucket: "react-chat-test-d4d3b.appspot.com",
    messagingSenderId: "397423367502",
    appId: "1:397423367502:web:0d46fbe9834913bbd73a1f"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

if (window.location.hostname === 'localhost') {
    // auth.useEmulator('http://localhost:9099');
    // db.useEmulator('localhost', '8080');
}

export { db, auth };
export default firebase;