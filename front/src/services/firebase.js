import {initializeApp} from 'firebase/app';
import { GoogleAuthProvider, signInWithPopup, getAuth, signInWithRedirect } from 'firebase/auth';


const firebaseConfig = {
   apiKey: "AIzaSyA4GiUbRRbtfklbB8SeHsyHJ1HUf9BwE1Y",
   authDomain: "mind-code.firebaseapp.com",
   projectId: "mind-code",
   storageBucket: "mind-code.firebasestorage.app",
   messagingSenderId: "338394892025",
   appId: "1:338394892025:web:ac7d9832b3a251246b4428",
   measurementId: "G-0XXH3XYDMX"
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
     localStorage.setItem('user_id', uid);
     localStorage.setItem('user_name', name);
     localStorage.setItem('user_email', gmail);
     const response = await fetch('/api/auth/google', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json',
         },
         body: JSON.stringify({ uid, name, gmail })
     });


     const data = await response.json();
     console.log('Respuesta del servidor:', data);
 } catch (error) {
     console.error('Error al iniciar sesión con Google:', error);
 }
};
