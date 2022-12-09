 
// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

    apiKey: 'AIzaSyBvYIUxkQXgXby3OdkDOjKldxwDhv9lg9w',

    authDomain: 'money-share-59f87.firebaseapp.com',

    databaseURL: 'https://money-share-59f87-default-rtdb.firebaseio.com',

    projectId: 'money-share-59f87',

    storageBucket: 'money-share-59f87.appspot.com',

    messagingSenderId: '980341261030',

    appId: '1:980341261030:web:e1a04a6bdb29c95f493127'

}


// Initialize Firebase

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)
export default db 
