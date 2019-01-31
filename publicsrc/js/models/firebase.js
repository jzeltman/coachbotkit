import UserModel from '../models/user';

export default function(){
    let xhr = new XMLHttpRequest();
    xhr.open('GET', window.location.origin + '/keys',true);
    xhr.send();
    xhr.onload = () => {
        firebase.initializeApp(JSON.parse(xhr.responseText));
        window.db = firebase.firestore();
        window.user = firebase.auth().currentUser;
        console.log('user',user);
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                console.log('user exists',user);
                if (window.user === null ){ window.user = new UserModel(user); }
                window.events.pub('auth:change',window.user); 
                // User is signed in.
            } else {
                // No user is signed in.
            }
        });
    }
}