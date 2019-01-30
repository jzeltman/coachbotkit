module.exports = (controller, dialogFlowMiddleware) => {

const getDateObj = (timeString) => {
    let date = new Date(null);
        date.setHours(timeString.split(':')[0]);
        date.setMinutes(timeString.split(':')[1]);
    return date;
}

const formatDate = (dateObj) => { return dateObj.toTimeString().substr(0,5); }

const getAvailableHours = (planData) => {
    console.log('getAvailableHours',planData);
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

    if (getDateObj(planData.chunkEnd) > getDateObj(planData.sleepTime)){
        planData.chunkEnd = planData.sleepTime;
    }

    convo.setVar('chunkStart',planData.chunkStart);
    convo.setVar('chunkEnd',planData.chunkEnd);
}

const isTimeRemaining = () =>{
    if (planData.timeChunk < planData.availableHours){ return true; }
    else { return false; }
}

let planData = {
    currentTime : formatDate(new Date()),
    startTime : formatDate(new Date()),
    timeBlocks : [],
    timeChunk : 0
};


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

controller.hears(['Plan my day'], 'message_received', (bot, message) => {
    bot.startConversation(message,(err,convo) => {

        convo.addMessage(`All right, it's ${planData.currentTime}`);

        convo.addQuestion(
            {
                text: 'For starters, when are you going to sleep?',
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
                console.log('aftertrigger');
                convo.stop();

            }, { key: 'sleepTime' });

    });
});

controller.on('getTimeChunkPlan',(bot,message) => {
    console.log('getTimeChunkPlan');
    bot.startConversation(message,(err,convo) => {

        if (planData.timeChunk === 0){
            convo.addMessage(`Ok, so it looks like you have ${planData.availableHours} hours to work with today.`);
            convo.addMessage(`Let's make the most of them`);
        }

        convo.addQuestion(
            `What would you like to do between ${planData.chunkStart} and ${planData.chunkEnd}?`,
            (res,convo) => {
                let start = planData.chunkStart,
                    end   = planData.chunkEnd;

                planData.timeBlocks[planData.timeChunk] = {
                    name : convo.extractResponse('chunkName'),
                    start, end
                };

                console.log('res',res,planData);

                if (isTimeRemaining()){ 
                    console.log('time remaining');
                    iterateChunks(end,convo); 
                    controller.trigger('getTimeChunkPlan',[bot,message]);
                } else { console.log('done',planData); }


            }, { key: 'chunkName' });
    });
});

};