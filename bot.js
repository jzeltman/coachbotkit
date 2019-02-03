/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


# EXTEND THE BOT:

  Botkit has many features for building cool and useful bots!

  Read all about it here:

    -> http://howdy.ai/botkit

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//const path                  = require('path');
//const debug                 = require('debug')('botkit:main');
const fs            = require('fs');
const Botkit        = require('botkit');
const bot_options   = { 
    replyWithTyping: true, 
    json_file_store: __dirname + '/.data/db/'
};

if (process.env.MODE === 'dev'){
    const env = require('node-env-file');
          env(__dirname + '/.env');
}

// Create the Botkit controller, which controls all instances of the bot.
const controller = Botkit.socketbot(bot_options);
const webserver = require(__dirname + '/components/express_webserver.js')(controller);

require(__dirname + '/components/plugin_identity.js')(controller);
controller.openSocketServer(controller.httpserver);
controller.startTicking();

if (process.env.DIALOG_FLOW_CONFIG){
    // Write file for config inclusion from env var 
    fs.writeFile(__dirname + '/dialogflow-config.json', process.env.DIALOG_FLOW_CONFIG, 'utf8', (err) => {
    //fs.writeFile(__dirname + '/dialogflow-config.json', JSON.stringify(process.env.DIALOG_FLOW_CONFIG), 'utf8', (err) => {
        if (err) console.error(err);
        const dialogflowMiddleware = require('botkit-middleware-dialogflow')({
            keyFilename: './dialogflow-config.json'
        });
        require('./skills/skills')(controller,dialogflowMiddleware);
    })

} else { require('./skills/skills')(controller); }

console.log('I AM ONLINE! COME TALK TO ME: http://localhost:' + (process.env.PORT || 3000))

function usage_tip() {
    console.log('~~~~~~~~~~');
    console.log('Botkit Starter Kit');
    console.log('Execute your bot application like this:');
    console.log('PORT=3000 node bot.js');
    console.log('~~~~~~~~~~');
}