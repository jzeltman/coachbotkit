module.exports = (controller,dialogFlowMiddelware) => {

    const conductOnboarding = (bot,message) => {
        bot.startConversation(message, function(err, convo) {
            convo.say({
                text: 'Hey there, I\'m coachbot. How can I help you succeed today?',
                quick_replies: [
                    {
                        title: 'Goals',
                        payload: 'Goals',
                    },
                    {
                        title: 'Motivation',
                        payload: 'Motivation',
                    },
                    {
                        title: 'Organization',
                        payload: 'Organization',
                    },
                    {
                        title: 'Ideas',
                        payload: 'Ideas',
                    },
                    {
                        title: 'Mindset',
                        payload: 'Mindset',
                    },
                    {
                        title: 'Planning',
                        payload: 'Plan my day',
                    }
                ]
            });
        });
    }

    controller.on('hello', conductOnboarding);
    controller.on('welcome_back', conductOnboarding);
}