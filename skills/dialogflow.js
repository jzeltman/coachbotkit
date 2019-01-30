module.exports = function (controller,dialogflowMiddleware) {
    console.log('dailogFlowSkills');
    controller.middleware.receive.use(dialogflowMiddleware.receive);

    controller.hears('DayPlanner', 'message_received', dialogflowMiddleware.hears, (bot,message) => {
        console.log('DialogFlow Message Logging\n~~~~~~~~~~~~~~~~~~\n',message,'\n~~~~~~~~~~~~~~~~~~');
        console.log('foo',message.fulfillment.text)
        bot.reply(message, {
            text: message.fulfillment.text
        });
        /*
    bot.reply(message, {
        convo.say({
            // 'Hey there, I\'m coachbot. How can I help you succeed today?'
            text: message.fulfillment.text,
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
                    title: 'Planner',
                    payload: 'Planner',
                },
            ]
        });
        */
    });
}