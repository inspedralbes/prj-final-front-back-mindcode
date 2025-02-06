import {initializeApp} from 'firebase/app';
import { GoogleAuthProvider, signInWithPopup, getAuth, signInWithRedirect } from 'firebase/auth';

const URL = process.env.NEXT_PUBLIC_URL;
const privkey = process.env.NEXT_PUBLIC_API_KEY;

const firebaseConfig = {
    apiKey: privkey,
    authDomain: "mind-code1.firebaseapp.com",
    projectId: "mind-code1",
    storageBucket: "mind-code1.firebasestorage.app",
    messagingSenderId: "170796916073",
    appId: "1:170796916073:web:bf3f51e731f4db905ff1f8",
    measurementId: "G-HP3CWCKL3F"
  };


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app


export const googleLogin = async () => {
 const provider = new GoogleAuthProvider();
 try {
     const result = await signInWithPopup(auth, provider);
     const user = result.user;

     const uid = user.uid;
     const name = user.displayName;
     const gmail = user.email;
    if(!gmail.endsWith('@inspedralbes.cat')){
        console.log("Incorrect Credentials");
        return googleLogin;
     }
    else{
     localStorage.setItem('user_id', uid);
     localStorage.setItem('user_name', name);
     localStorage.setItem('user_email', gmail);
     const response = await fetch(`${URL}/api/auth/google`, {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json',
         },
         body: JSON.stringify({ uid, name, gmail })
     });

     const textResponse = await response.text();
     console.log(textResponse);

 }} catch (error) {
     console.error('Error al iniciar sesión con Google:', error);
 }
};
