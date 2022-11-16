import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";


const firebaseConfig = {
	apiKey: "AIzaSyA8ws3ThTyJro3qFyF3h2r9YTe63VdKs1U",
	authDomain: "womanup-4834f.firebaseapp.com",
	projectId: "womanup-4834f",
	storageBucket: "womanup-4834f.appspot.com",
	messagingSenderId: "846100260533",
	appId: "1:846100260533:web:5daefbd0f7f97abbd540fc"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)

export { db, storage };