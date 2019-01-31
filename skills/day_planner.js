const Dict = require('./_dictionary').dictionary;
const getPhrase = require('./_dictionary').getPhrase;

module.exports = (controller, dialogFlowMiddleware) => {

const getDateObj = (timeString) => {
    let date = new Date(null);
        date.setHours(timeString.split(':')[0]);
    return date;
}

const formatDate = (dateObj) => { return dateObj.toTimeString().substr(0,5); }

const getAvailableHours = (planData) => {
    let startTime = planData.startTime;
        if (planData.wakeTime){ startTime = planData.wakeTime; }
    let date1 = getDateObj(startTime);
    let date2 = getDateObj(planData.sleepTime);

    return Math.floor(Math.abs(date1 - date2) / 36e5);
}

const getNextHour = (planData,startTime) => {
    let date = getDateObj(startTime); 
        date.setHours(date.getHours() + 1);
        return formatDate(date);
}

const iterateChunks = (end,convo) => {
    planData.timeChunk++;
    planData.chunkStart = end;
    planData.chunkEnd   = getNextHour(planData,end);

    if (getDateObj(planData.chunkEnd) >= getDateObj(planData.sleepTime)){
        planData.chunkEnd = planData.sleepTime;
    }
}

const isTimeRemaining = () => {
    if (planData.timeChunk < planData.availableHours - 1){ return true; }
    else { return false; }
}

const getPlanMarkup = () => {
    let markup = '';

    planData.timeBlocks.forEach( block => {
        markup += `
            <li>
                <span class="event-time">${block.start}-${block.end}</span>
                <span class="event-name">${block.name}</span>
            </li>`;
    });

    return markup;
}

let planData = {
    currentTime : formatDate(new Date()),
    startTime : formatDate(new Date()),
    timeBlocks : [],
    timeChunk : 0
};


/*
controller.hears(['Planning'], 'message_received', (bot, message) => {
    bot.reply(message, {
        text: 'All right, what can I help you plan?',
        quick_replies: [
            {
                title: 'Plan my day',
                payload: 'Plan my day',
            },
            {
                title: 'Plan tomorrow',
                payload: 'Plan tomorrow',
            }
        ]
    });
});
*/

controller.hears(['Plan my day'], 'message_received', (bot, message) => {
    bot.startConversation(message,(err,convo) => {

        convo.addMessage(`All right, it's ${planData.currentTime}`);

        convo.addQuestion(
            {
                text: getPhrase('day_planner_sleep_time'), 
                time: 'true'
            },
            (res,convo) => {
                planData.sleepTime      = convo.extractResponse('sleepTime');
                planData.availableHours = getAvailableHours(planData); 
                planData.chunkStart     = planData.startTime;
                planData.chunkEnd       = getNextHour(planData,planData.startTime);

                convo.setVar('chunkStart',planData.chunkStart);
                convo.setVar('chunkEnd',planData.chunkEnd);
                convo.setVar('availableHours',planData.availableHours);

                controller.trigger('getTimeChunkPlan',[bot,message]);
                convo.stop();

            }, { key: 'sleepTime' });

    });
});

controller.on('getTimeChunkPlan',(bot,message) => {
    bot.startConversation(message,(err,convo) => {

        convo.setVar('chunkStart',planData.chunkStart);
        convo.setVar('chunkEnd',planData.chunkEnd);

        if (planData.timeChunk === 0){
            convo.addMessage(`Ok, so it looks like you have ${planData.availableHours} hours to work with today.`);
            convo.addMessage(`Let's make the most of them`);
        }

        convo.addQuestion(
            getPhrase('day_planner_time_chunk'),
            (res,convo) => {
                let start = planData.chunkStart,
                    end   = planData.chunkEnd;

                planData.timeBlocks[planData.timeChunk] = {
                    name : convo.extractResponse('chunkName'),
                    start, end
                };

                if (isTimeRemaining()){ 
                    iterateChunks(end); 
                    controller.trigger('getTimeChunkPlan',[bot,message]);
                } else { 
                    controller.trigger('agenda',[bot,message]);
                    convo.stop();
                }


            }, { key: 'chunkName' });
    });
});

controller.on('agenda',(bot,message) => {
    bot.startConversation(message,(err,convo) => {
        convo.addMessage(getPhrase('day_planner_before_agenda'));
        convo.addMessage({
            text: `<div class="agenda">
                        <strong>Agenda for ${new Date().toDateString()}</strong>
                        <ul>${getPlanMarkup()}</ul>
                    </div>`
        });
        convo.addMessage({
            text: getPhrase('day_planner_after_agenda'),
            quick_replies: Dict.login_quick_replies
        });
    });
});

};