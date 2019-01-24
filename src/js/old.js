let app, db, user;

const uuidv4 = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

const projectSubmitHandler = (e) => {
    e.preventDefault();
    console.log('projectSubmitHandler',e);

    if (!user){ 
        googleLogin();
    } else {

        let project = new ProjectModel({
            db : db, 
            data: {
                task : [],
                name : e.target.project_name.value,
                date : e.target.project_due.value, 
                notes: e.target.project_notes.value,
                user : user.uid
            }, 
            id : uuidv4()
        });

        project.create();
    }
}

const taskSubmitHandler = (e) => {
    e.preventDefault();
    console.log('taskSubmitHandler',e);

    if (!user){ 
        googleLogin();
    } else {

        let task = new TaskModel({
            db : db, 
            data: {
                name : e.target.task_name.value,
                date : e.target.task_due.value, 
                notes: e.target.task_notes.value,
                user : user.uid
            }, 
            id : uuidv4()
        });

        task.create();
console.log('form data',task);
    }
}

document.addEventListener('DOMContentLoaded', firebaseInit); 
document.querySelector('form[action="/task/new"]').addEventListener('submit',taskSubmitHandler);
document.querySelector('form[action="/project/new"]').addEventListener('submit',projectSubmitHandler);