module.exports = function (controller,dialogflowMiddleware) {
    controller.middleware.receive.use(dialogflowMiddleware.receive);

    controller.hears(['Default Welcome Intent'], 'direct_message', dialogflowMiddleware.hears, (bot,message) => {
    //controller.on('direct_message', dialogflowMiddleware.hears, (bot,message) => {
        console.log('testing',message);
        replyText = message.fulfillment.text;  // message object has new fields added by Dialogflow
        bot.reply(message, replyText);
    });

    controller.hears(['mousetestcoachbot'], 'message_received', dialogflowMiddleware.hears, (bot,message) => {
    //controller.on('direct_message', dialogflowMiddleware.hears, (bot,message) => {
        console.log('mouse testing',message);
        replyText = message.fulfillment.text;  // message object has new fields added by Dialogflow
        bot.reply(message, replyText);
    });
}