module.exports = function skills(controller,dialogflowMiddleware) {
    controller.middleware.receive.use((bot, message, next) => {
        console.log('Message Logging\n~~~~~~~~~~~~~~~~~~\n',message,'\n~~~~~~~~~~~~~~~~~~');
        next();
    });

    require('./unhandled_messages')(controller,dialogflowMiddleware);
    //require('./dialogflow')(controller,dialogflowMiddleware);
    require('./onboarding')(controller,dialogflowMiddleware);
    require('./day_planner')(controller,dialogflowMiddleware);
}