import UserButtonView  from './user-button';
import UserProfileView  from './user-profile';

export default class AppView {
    constructor(el){
        this.$el        = document.querySelector('body');
        this.$user      = this.$el.querySelector('#user');
        this.$main      = this.$el.querySelector('main');

        this.userButtonView = new UserButtonView(this.$user);

        window.events.sub('auth:success',() => { new UserProfileView(this.$main); });
        window.events.sub('user_profile',() => { new UserProfileView(this.$main); });
    }
}