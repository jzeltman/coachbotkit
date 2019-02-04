export default class ChatView {
    constructor(config) {
        this.el = config.el;
        this.events = window.events;
        this.messages = [];
        this.render();

        this.events.sub('message_received', this.newMessageHandler.bind(this));
    }

    newMessageHandler(e){
        if (e.detail){
            switch (e.detail.type){
                case 'message':
                    this.message = e.detail; 
                    this.messages.push(e.detail);
                    this.el.classList.remove('typing');
                    this.updateMessages();
                    break;
                case 'typing':
                    this.el.classList.add('typing');
                    break;
            }
        }
    }

    render(){
        this.teardownListeners();
        this.el.innerHTML = `
            <section id="message-list">
                <div id="messages">${this.renderMessages()}</div>
            </section>
            <footer>${this.footerMarkup()}</footer>`;
        this.afterRender();
    }

    teardownListeners(){}
    afterRender(){
        this.el.querySelector('input').focus();
        this.el.querySelector('input[type=text]').addEventListener('keyup',this.textInputHandler.bind(this));
        this.el.querySelector('#message-list').addEventListener('click',this.clickHandler.bind(this));
    }

    renderMessages(e){
        let messages = '';
        this.messages.forEach( (message, i) => {
            messages += `<div class="message ${message.type} ${message.sender}" 
                              data-timestamp="${message.sent_timestamp}">${message.text}</div>`;
            if (message.quick_replies && i === this.messages.length - 1){
                messages += this.quickReplies(message);
            }
        });
        return messages += this.typingIndicator();
    }

    updateMessages(){ 
        let $messageList = this.el.querySelector('#message-list');
        $messageList.querySelector('#messages').innerHTML = this.renderMessages(); 
        $messageList.scrollTop = $messageList.scrollHeight; 
    }

    quickReplies(message){
        let replies = '';
        message.quick_replies.forEach( reply => {
            replies += `<a href=""
                           class="quick-reply" 
                           data-action="${reply.action}"
                           data-payload="${reply.payload}">${reply.title}</a>`;
        });
                        
        return `<div id="quick-replies">${replies}</div>`;
    }

    typingIndicator(){
        return  `<div class="message typing">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>`; 
    }

    textInputMarkup(){
        return `<input type="text" placeholder="Hey Chatbot..." />`;
    }

    footerMarkup(){
        return this.textInputMarkup();
    }

    textInputHandler(e){ 
        if (e.keyCode === 13){
            this.sendMessage(e.target.value);
            e.target.value = '';
        }
    }

    sendMessage(data){
        let message = { 
            type: 'message',
            text: data, 
            user: window.user.uid,
            channel: 'socket',
            sender: 'user'
        };
        this.messages.push(message);
        this.updateMessages();
        this.events.pub('send_message',message); 
    }

    clickHandler(e){
        if (e.target.classList.contains('quick-reply')) this.quickReplyClickHandler(e);
    }

    quickReplyClickHandler(e){
        e.preventDefault();

        if (e.target.dataset.action !== 'undefined'){
            let event = e.target.dataset.action.split(':')[0],
                detail = e.target.dataset.action.split(':')[1];
            this.events.pub(event, detail, true);
        } else {
        this.sendMessage(e.target.dataset.payload);

        }
        this.el.querySelector('input').focus();
    }

}