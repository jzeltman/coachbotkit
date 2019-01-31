export default class AppView {
    constructor(el){
        this.$el        = document.querySelector('body');
        this.$user      = this.$el.querySelector('#user');
        this.$main      = this.$el.querySelector('main');
    }
}