const dictionary = {
    help_quick_replies : [
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
    ],
    login_quick_replies: [
        {
            title: 'Login with Google',
            payload: 'Login with Google',
            action: 'trigger-login:google'
        },
        {
            title: 'Login with facebook',
            payload: 'Login with facebook',
            action: 'trigger-login:fb'
        },
        {
            title: 'Login with email',
            payload: 'Login with email',
            action: 'trigger-login:email'
        }
    ],
    day_planner_sleep_time: [
        'For starters, when are you going to sleep?',
        `Let's begin with what time are you going to bed?`,
        'First thing I need to know is when is your bedtime'
    ],
    day_planner_time_chunk: [
        `What would you like to do between {{vars.chunkStart}} and {{vars.chunkEnd}}?`,
        `What are you doing between {{vars.chunkStart}} and {{vars.chunkEnd}}?`,
        `What are you getting done from {{vars.chunkStart}} to {{vars.chunkEnd}}`,
        `What's the plan from {{vars.chunkStart}} to {{vars.chunkEnd}}`
    ],
    day_planner_before_agenda: [
        `Good job, here's your agenda`,
        `Great, here's what's on the docket`,
    ],
    day_planner_after_agenda: [
        `As Antoine de Saint-Exupéry said: "A goal without a plan is just a wish."`,
        `"Plan your work and work your plan." ~ Napoleon Hill`
    ]
}

const getPhrase = (key) => {
    let random = Math.floor(Math.random() * dictionary[key].length);
    return dictionary[key][random];
}

module.exports.dictionary = dictionary;
module.exports.getPhrase  = getPhrase;