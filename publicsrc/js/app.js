import Utils from './utils/_utils';
import AppView from './views/app';
import CoachBotKit from './controllers/botkit';
import FirebaseInit from './models/firebase';

export default class MyApp {
    constructor(){
        FirebaseInit();
        Botkit.boot();
        new AppView();

        window.events.sub('auth:success', this.updateBotKitUser.bind(this)); 
        window.events.sub('auth:change', this.updateBotKitUser.bind(this)); 
        window.events.sub('trigger-login',this.triggerLogin.bind(this));
    }

    updateBotKitUser(data){
        console.log('updateBotKitUser', window.user);
        Botkit.identifyUser({
            id : window.user.uid,
            name : window.user.data.displayName,
            first_name : window.user.data.displayName,
            last_name : window.user.data.displayName,
            full_name : window.user.data.displayName,
            gender : window.user.data.gender,
            timezone : window.user.data.timezone
        });
    }

    triggerLogin(e,b){
        console.log('triggerLogin',e,b);
        Utils.Auth();
    }
}