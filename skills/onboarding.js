const Dict = require('./_dictionary').dictionary;

module.exports = (controller,dialogFlowMiddelware) => {

    const conductOnboarding = (bot,message) => {
        bot.startConversation(message, function(err, convo) {
            convo.say({
                text: 'Hey there, I\'m coachbot. How can I help you succeed today?',
                quick_replies: Dict.help_quick_replies
            });
        });
    }

    controller.on('hello', conductOnboarding);
    controller.on('welcome_back', conductOnboarding);
}