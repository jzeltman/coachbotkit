import UserModel from '../models/user';

export default function googleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => {
                firebase.auth().signInWithPopup(provider).then(result => {
                    window.user = new UserModel(result);
                    window.events.pub('auth:success',window.user);
                });
        });
}