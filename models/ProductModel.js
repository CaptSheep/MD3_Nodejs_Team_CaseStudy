let Database = require('./Database');

class ProductModel{
    constructor() {
        this.conn = Database.connect();
    }
    async getAllProduct(){
        return new Promise((resolve, reject)=>{
            let sqlSelect = 'SELECT * FROM Product';
            this.conn.query(sqlSelect, (err, data)=>{
                if(err){
                    reject(err);
                }
                resolve(data);
            })
        })
    }
    async getProdcutById(id){
        return new Promise((resolve, reject)=>{
            let sqlSelect = `SELECT * FROM Product where productStatus != 0 and productId = ${id}`;
            this.conn.query(sqlSelect, (err, data)=>{
                if(err){
                    reject(err);
                }
                resolve(data);
            })
        })
    }
    async getProductByCategory(id){
        return new Promise((resolve, reject)=>{
            let sqlSelect = `SELECT * FROM Product where productStatus != 0 and productCatergoryId = ${id}`;
            this.conn.query(sqlSelect, (err, data)=>{
                if(err){
                    reject(err);
                }
                resolve(data);
            })
        })
    }
    async updateProductById(newProduct, id){
        return new Promise((resolve, reject)=>{
            let sqlUpdate = `UPDATE Product SET productName = N'${newProduct.productName}', productCategoryId = ${newProduct.productCategoryId}, productPrice = ${newProduct.productPrice}, productQuantity = ${newProduct.productQuantity}, productDescription = N'${newProduct.productDescription}', productStatus = ${newProduct.productStatus === 'Active'? 1 : 0}  WHERE productId = ${id}`
            this.conn.query(sqlUpdate, (err, data)=>{
                if(err){
                    reject(err);
                }
                console.log( data)
                resolve(data);
            })
        })
    }
    async createProduct(newProduct){
        return new Promise((resolve, reject)=>{
            let sqlCreate = `call createProduct('${newProduct.productName}' , ${newProduct.productCategoryId}, ${newProduct.productPrice}, ${newProduct.productQuantity},'${newProduct.productDescription}' , '${newProduct.imageLink}')`
            this.conn.query(sqlCreate, (err, data)=>{
                if(err){
                    reject(err);
                }
                console.log( data)
                resolve(data);
            })
        })
    }
}

module.exports = ProductModel;