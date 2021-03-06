const Dict = require('./_dictionary').dictionary;

module.exports = function(controller) {

    controller.on('message_received', function(bot, message) {

        bot.reply(message, {
            text: 'I do not know how to respond to that message yet.  Define new features by adding skills in my `skills/` folder.  [Read more about building skills](https://github.com/howdyai/botkit-starter-web/blob/master/docs/how_to_build_skills.md).\n\n(This message is from the unhandled_messages skill.)',
            quick_replies: [
                {
                  title: 'Help',
                  payload: 'help',
                },
              ]
        });

    });

    controller.hears(['help','Goals', 'Ideas', 'Mindset', 'Organization'], 'message_received', (bot, message) => {
        bot.startConversation(message, (err, convo) => {
            convo.say({
                text: 'I\'m sorry to say that I\'m not trained to help you with that yet. But I\'m working on it!',
                quick_replies: Dict.help_quick_replies
            })
        });
    });

}