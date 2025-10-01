// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDHs4nhw1AHuEK303uuSXEPfT_Wv73iVQQ",
	authDomain: "botanic-master.firebaseapp.com",
	projectId: "botanic-master",
	storageBucket: "botanic-master.firebasestorage.app",
	messagingSenderId: "141914362417",
	appId: "1:141914362417:web:7574eec434676078c0fb10",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);