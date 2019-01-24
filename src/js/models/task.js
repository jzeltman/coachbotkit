class TaskModel extends Model {
    constructor(config){        
        super(config)
        this.collectionType = 'tasks';
        if (!config.data){ 
            this.data = {
                name : '',
                date : '',
                notes : '',
                createDate : new Date().toTimeString()
            }
        }
    }
}