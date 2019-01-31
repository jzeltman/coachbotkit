module.exports = function (controller,dialogflowMiddleware) {
    controller.middleware.receive.use(dialogflowMiddleware.receive);

    controller.hears('DayPlanner', 'message_received', dialogflowMiddleware.hears, (bot,message) => {
        console.log('DialogFlow Message Logging\n~~~~~~~~~~~~~~~~~~\n',message,'\n~~~~~~~~~~~~~~~~~~');
        bot.reply(message, { text: message.fulfillment.text });
    });
}