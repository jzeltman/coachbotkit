import UserModel from '../models/user';
import Chat from '../chat/chat';

export default function(){
    let xhr = new XMLHttpRequest();
    xhr.open('GET', window.location.origin + '/keys',true);
    xhr.send();
    xhr.onload = () => {
        firebase.initializeApp(JSON.parse(xhr.responseText));
        window.db = firebase.firestore();

        firebase.auth().onAuthStateChanged(userData => {
            if (userData) {
                console.log('user exists',userData);
                window.user = new UserModel(userData);
            } else {
                console.log('no user exists, start with anonymous');
                window.user = new UserModel();
            }

            console.log('user',window.user);
            window.chat = new Chat(window.user);
        });
    }
}