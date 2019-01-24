import Utils        from '../utils/_utils';

export default class UserButtonView {
    constructor(el){
        this.$el = el;
        this.events = window.events;
        this.template();
        this.events.log('button Auth',el,Utils);

        this.events.sub('auth:success',this.updateViewWithModel.bind(this));
        this.events.sub('user_model:create',this.template.bind(this));
        this.events.sub('user_model:delete',this.updateViewWithModel.bind(this));
    }

    template(){
        let markup;
        if (this.model === undefined){
            markup = `<button id="login">Login</button>`;
        } else {
            markup = `<button id="profile">My Profile</button>`;
        }
        this.$el.innerHTML = markup; 
        this.$el.querySelector('button').addEventListener('click',this.buttonClickHandler.bind(this));
    }

    buttonClickHandler(e){
        if (!window.timezoneData){ this.getTimezones(); }
        if (e.target.getAttribute('id') === 'login'){ Utils.Auth(); } 
        else { window.events.pub('user_profile', null); }
    }

    updateViewWithModel(e){
        this.model = window.user;
        this.template();
    }

    getTimezones(){
        let xhr = new XMLHttpRequest();
        xhr.open('GET', window.location.origin + '/json/timezones.json',true);
        xhr.send();
        xhr.onload = () => {
            const data = JSON.parse(xhr.responseText);
            window.events.pub('user_button:timezone',data); 
            window.timezoneData = data;
        }
    }
}