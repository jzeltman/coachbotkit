import Choices from 'choices.js';

export default class UserProfileView {
    constructor(el,model){
        this.$el = el;
        this.events = window.events;
        this.model = window.user;
        this.timezoneData = window.timezoneData; 

        this.template();

        this.events.sub('user_button:timezone', data => {
            this.timezoneData = data.detail;
            this.template.bind(this)
        });
        this.events.sub('user_model:update',this.template.bind(this));
        this.events.sub('user_model:delete',this.teardown.bind(this));
    }

    timezonesMarkup(){
        if (!this.timezoneData){ return ''; }
        else {
            let options = this.timezoneData.map( timezone => {
                if ( `${timezone.offset}-${timezone.abbr}` === this.model.data.timezone){
                    return `<option selected="selected" value="${timezone.offset}-${timezone.abbr}">${timezone.text}</option>`;
                } else {
                    return `<option value="${timezone.offset}-${timezone.abbr}">${timezone.text}</option>`;
                }
            }).join('');
            return `<select name="timezones">${options}</select>`;
        } 
    }

    template(){
        this.events.log('template',this);
        this.$el.innerHTML = `
            <section id="user-profile">
                <aside>
                    <img src="${this.model.data.photoURL}" name="photo" />
                    <i class="fas fa-trash-alt"></i>
                </aside>

                <form>
                    <label for="display_name">Display Name</label>
                    <input type="text" value="${this.model.data.displayName}" name="display_name" />

                    <label for="email">Email</label>
                    <input type="email" value="${this.model.data.email}" name="email" />

                    <label for="timezone">Timezone</label>
                    ${this.timezonesMarkup()}

                    <input type="submit" class="button" value="Update" name="update" />
                </form>
            </section>
        `;
        this.setupEvents();
    }

    setupEvents(){
        this.$timezones = new Choices(this.$el.querySelector('select[name="timezones"]'));
        this.$el.querySelector('i.fa-trash-alt').addEventListener('click',this.deleteHandler.bind(this));
        this.$el.querySelector('input[type="submit"]').addEventListener('click',this.submitHandler.bind(this));
    }

    teardownEvents(){
        this.$el.querySelector('i.fa-trash-alt').removeEventListener('click',this.deleteHandler.bind(this));
        this.$el.querySelector('input[type="submit"]').removeEventListener('click',this.submitHandler.bind(this));
    }

    teardown(){
        this.teardownEvents();
        this.$el.querySelector('#user-profile').remove();
    }

    submitHandler(e){
        e.preventDefault();
        this.events.log('submitHandler',e);
        let $selectEl = this.$el.querySelector('select[name="timezones"]');

        this.model.update({
            displayName : this.$el.querySelector('input[name="display_name"]').value,
            email: this.$el.querySelector('input[name="email"]').value,
            timezone: this.$timezones.getValue().value 
        });

        this.model.save();
    }

    deleteHandler(){
this.events.log('deleteHandler');
        const result = window.confirm('Are you sure you want to do this? All your data will be deleted permanently');
        if (result){ this.model.delete(); }
    }

} 