const Dict = require('./_dictionary').dictionary;

module.exports = (controller,dialogFlowMiddelware) => {

    const conductOnboarding = (bot,message) => {
        bot.startConversation(message, (err,convo) => {
            convo.say({
                text: 'Hey there, I\'m coachbot. How can I help you succeed today?',
                quick_replies: Dict.help_quick_replies
            });
        });
    }

    const welcomeBack = (bot,message) => {
        let userName = '';
        controller.storage.users.get(message.user, (err,user) => {
            if (err) throw err;
            username = user.name;
        })
        bot.startConversation(message, function(err, convo) {
            convo.say({
                text: `Hey ${username}, welcome back. What do you want to do today?`,
                quick_replies: Dict.help_quick_replies
            });
        });
    }

    controller.on('hello', conductOnboarding);
    controller.on('welcome_back', welcomeBack);
}