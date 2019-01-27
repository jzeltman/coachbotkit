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
const env                   = require('node-env-file');
      env(__dirname + '/.env');
const path                  = require('path');
const fs                    = require('fs');
const Botkit                = require('botkit');
const debug                 = require('debug')('botkit:main');
const dialogflowMiddleware  = require('botkit-middleware-dialogflow')({
    keyFilename: './dialogflow-config.json' 
});
const bot_options           = { replyWithTyping: true, };

// Use a mongo database if specified, otherwise store in a JSON file local to the app.
// Mongo is automatically configured when deploying to Heroku
if (process.env.MONGO_URI) {
    // create a custom db access method
    var db = require(__dirname + '/components/database.js')({});
    bot_options.storage = db;

         // store user data in a simple JSON format 
} else { bot_options.json_file_store = __dirname + '/.data/db/'; }

// Create the Botkit controller, which controls all instances of the bot.
const controller = Botkit.socketbot(bot_options);

// Set up an Express-powered webserver to expose oauth and webhook endpoints
const webserver = require(__dirname + '/components/express_webserver.js')(controller);

// Load in some helpers that make running Botkit on Glitch.com better
require(__dirname + '/components/plugin_glitch.js')(controller);

// Load in a plugin that defines the bot's identity
require(__dirname + '/components/plugin_identity.js')(controller,dialogflowMiddleware);

// Open the web socket server
controller.openSocketServer(controller.httpserver);

// Start the bot brain in motion!!
controller.startTicking();

const normalizedPath = path.join(__dirname, "skills");

const loadSkills = (filepath,rootPath) => {
    fs.readdirSync(filepath).forEach( file => {
        if (!fs.lstatSync(rootPath + file).isDirectory()){
            require(rootPath + file)(controller,dialogflowMiddleware);
        } else { 
            console.log('is directory',rootPath+ file); 
            fs.readdirSync(rootPath + file).forEach( childFile => {
                require(rootPath + childFile)(controller,dialogflowMiddleware);
            });
        }
    });
} 

fs.readdirSync(normalizedPath).forEach( file => {
    // update to allow folders as well 
    if (!fs.lstatSync('./skills/' + file).isDirectory()){
        require("./skills/" + file)(controller,dialogflowMiddleware);
    } else { 
        fs.readdirSync('./skills/' + file).forEach( childFile => {
            require("./skills/" + childFile)(controller,dialogflowMiddleware);
        });
    }
});

console.log('I AM ONLINE! COME TALK TO ME: http://localhost:' + (process.env.PORT || 3000))

function usage_tip() {
    console.log('~~~~~~~~~~');
    console.log('Botkit Starter Kit');
    console.log('Execute your bot application like this:');
    console.log('PORT=3000 node bot.js');
    console.log('~~~~~~~~~~');
}