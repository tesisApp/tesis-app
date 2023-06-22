import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export const firebaseConfig = {
    apiKey: "AIzaSyDm-rFOuuaC59mAcEcTrE62BIBC1mRYmf4",
    authDomain: "tesisarduinogps.firebaseapp.com",
    databaseURL: "https://tesisarduinogps-default-rtdb.firebaseio.com",
    projectId: "tesisarduinogps",
    storageBucket: "tesisarduinogps.appspot.com", 
    messagingSenderId: "36682550904",
    appId: "1:36682550904:web:90315c681789996a1ce78d",
    measurementId: "G-NS9L2RNE6C"
}

export const FIREBASE_APP = initializeApp(firebaseConfig)
export const FIRESTORE_DB = getFirestore(FIREBASE_APP)
export const FIRESTORE_AUTH = getAuth(FIREBASE_APP)
