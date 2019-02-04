export default class Chat {
    constructor(user){
        console.log('New Chat with user:',user);
        this.user = user;
        this.events = window.events;
        this.config = {
            url: (location.protocol === 'https:' ? 'wss' : 'ws') + '://' + location.host,
            reconnect_timeout: 3000,
            max_reconnect: 5
        };

        this.socket = new WebSocket(this.config.url);

        this.socket.addEventListener('open', this.openEventHandler.bind(this));
        this.socket.addEventListener('message', this.messageHandler.bind(this));
        
        this.events.sub('send_message',this.deliverMessage.bind(this))
    }

    deliverMessage(message) { 
        if (message.detail) message = message.detail;
        this.socket.send(JSON.stringify(message)); 
    }

    openEventHandler(e){
        this.reconnect_count = 0;
        this.events.pub('connected',e);
        let type = this.user.displayName === undefined ? 'hello' : 'welcome_back';
        this.deliverMessage({
            user: window.user.uid, 
            channel: 'socket',
            user_profile: window.user.data, 
            type 
        });
    }

    messageHandler(e){
        try { this.events.pub('message_received', JSON.parse(e.data)); } 
        catch (err) { window.events.pub('socket_error',err); return; }
    }
}