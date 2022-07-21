let Database = require('./Database');

class ImageModel{
    constructor() {
        this.conn = Database.connect();
    }
    async getOneImageByProductId(id){
        return new Promise((resolve, reject)=>{
            let sqlSelect = `SELECT * FROM productImage WHERE productId = ${id} LIMIT 1`;
            this.conn.query(sqlSelect, (err, data)=>{
                if(err){
                    reject(err);
                }
                resolve(data);
            })
        })
    }
    async updateImageByProductID(id, link){
        return new Promise((resolve, reject)=>{
            let sqlUpdate = `UPDATE productimage SET imageLink = '${link}' WHERE productId = ${id}`;
            this.conn.query(sqlUpdate, (err, data)=>{
                if(err){
                    console.log(err);
                    reject(err);
                }
                resolve(data);
            })
        })
    }

}

module.exports = ImageModel;