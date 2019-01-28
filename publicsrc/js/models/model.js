class Model {
    constructor(config){
        this.id = config.id || uuidv4(); 
        this.db = config.db;
        this.collectionType = config.collection;

        if (config.data){ 
            this.data = config.data; 
            this.data.createdDate = new Date().toTimeString();
        } else {
            this.data = {
                createDate : new Date().toTimeString()
            }
        }
    }

    create(){
        console.log(`create ${this.collectionType} in firebase`,this.db,this.data);
        this.db.collection(this.collectionType).add(this.data).then( (a,b,c) => console.log(`${this.collectionType} created`,a,b,c));
    }
}