import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBz_DKKSkNLgQcPPJCXnI_P3aqpHLWYsFE",
  authDomain: "expensetracker-ed7a4.firebaseapp.com",
  projectId: "expensetracker-ed7a4",
  storageBucket: "expensetracker-ed7a4.appspot.com",
  messagingSenderId: "537102939392",
  appId: "1:537102939392:web:9bda19a2cfed63d1deafe5",
  measurementId: "G-XBMJ6ZPZ9T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };