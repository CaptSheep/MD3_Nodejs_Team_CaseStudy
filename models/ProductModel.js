let Database = require('./Database');

class ProductModel{
    constructor() {
        this.conn = Database.connect();
    }
    async getDetailProduct(id){
        return new Promise((resolve, reject)=>{
            let sqlSelect = `select * from product inner join productimage on product.productId = productimage.productId where product.productId = ${id}`;
            this.conn.query(sqlSelect, (err, data)=>{
                if(err){
                    reject(err);
                }
                resolve(data);
            })
        })
    }

    async getAllProductUser(){
        return new Promise((resolve, reject)=>{
            let sqlSelect = 'SELECT * FROM userProduct_view';
            this.conn.query(sqlSelect, (err, data)=>{
                if(err){
                    reject(err);
                }
                resolve(data);
            })
        })
    }
    async SortProductDesc(){
        return new Promise((resolve, reject)=>{
            let sqlSelect = 'select * from userProduct_view order by productPrice DESC';
            this.conn.query(sqlSelect, (err, data)=>{
                if(err){
                    reject(err);
                }
                resolve(data);
            })
        })
    }

    async SortProductAsc(){
        return new Promise((resolve, reject)=>{
            let sqlSelect = 'select * from userProduct_view order by productPrice ASC';
            this.conn.query(sqlSelect, (err, data)=>{
                if(err){
                    reject(err);
                }
                resolve(data);
            })
        })
    }

    async SortProductName(){
        return new Promise((resolve, reject)=>{
            let sqlSelect = 'select * from userProduct_view order by productName';
            this.conn.query(sqlSelect, (err, data)=>{
                if(err){
                    reject(err);
                }
                resolve(data);
            })
        })
    }

    async getAllProduct(){
        return new Promise((resolve, reject)=>{
            let sqlSelect = 'SELECT * FROM showProduct';
            this.conn.query(sqlSelect, (err, data)=>{
                if(err){
                    reject(err);
                }
                resolve(data);
            })
        })
    }
    async getProductById(id){
        return new Promise((resolve, reject)=>{
            let sqlSelect = `SELECT * FROM product where productId = ${id}`;
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
            let sqlSelect = `SELECT * FROM product where productStatus != 0 and productCatergoryId = ${id}`;
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
            let sqlUpdate = `UPDATE product SET productName = N'${newProduct.productName}', productCategoryId = ${newProduct.productCategoryId}, productPrice = ${newProduct.productPrice}, productQuantity = ${newProduct.productQuantity}, productDescription = N'${newProduct.productDescription}', productStatus = ${newProduct.productStatus === 'Active'? 1 : 0}  WHERE productId = ${id}`
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