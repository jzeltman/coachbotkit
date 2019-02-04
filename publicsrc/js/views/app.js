import ChatView from './chat/chat';

export default class AppView {
    constructor(el){
        this.$el        = document.querySelector('body');
        this.$header    = this.$el.querySelector('header');
        this.$user      = this.$el.querySelector('#user');
        this.$main      = this.$el.querySelector('main');
        this.$chat      = this.$el.querySelector('#chatbot');
        new ChatView({ el: this.$chat });

        this.$user.addEventListener('click',this.userProfileClickHandler.bind(this));

        window.events.sub('auth:change', this.updateUserProfile.bind(this)); 
    }

    updateUserProfile(){

        if (window.user !== null){
            try {
            console.log('foooooo',window.user,window.user.data.photoURL);
                this.$user.innerHTML = `<img src=${window.user.data.photoURL} class="user-profile-img" />`;
                this.$header.classList.remove('logged-out');
                this.$header.classList.add('logged-in');
            } catch(e) { console.error(e); }
        }
    }

    userProfileClickHandler(){
        console.log('userProfileClickHandler',window.user);
    }
}