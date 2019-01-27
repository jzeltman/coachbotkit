export default function(){
    let xhr = new XMLHttpRequest();
    xhr.open('GET', window.location.origin + '/keys',true);
    xhr.send();
    xhr.onload = () => {
        firebase.initializeApp(JSON.parse(xhr.responseText));
        window.db = firebase.firestore();
    }
}