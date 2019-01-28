class ProjectModel extends Model {
    constructor(config){        
        super(config)
        this.collectionType = 'projects';
        if (!config.data){ 
            this.data = {
                name : '',
                date : '',
                notes : '',
                task : [],
                createDate : new Date().toTimeString()
            }
        }
    }
}