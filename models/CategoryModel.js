let Database = require('./Database');

class CategoryModel{
    constructor() {
        this.conn = Database.connect();
    }
    async getAllCategory(){
        return new Promise((resolve, reject)=>{
            let sqlSelect = 'SELECT * FROM category';
            this.conn.query(sqlSelect, (err, data)=>{
                if(err){
                    reject(err);
                }
                resolve(data);
            })
        })
    }
    async getCategoryByName(){
        return new Promise((resolve, reject)=>{
            let sqlSelect = 'SELECT * FROM category';
            this.conn.query(sqlSelect, (err, data)=>{
                if(err){
                    reject(err);
                }
                resolve(data);
            })
        })
    }
}

module.exports = CategoryModel;