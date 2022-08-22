let Database = require('./Database');

class CategoryModel {
    constructor() {
        this.conn = Database.connect();
    }

    async getAllCategory() {
        return new Promise((resolve, reject) => {
            let sqlSelect = 'SELECT * FROM Category';
            this.conn.query(sqlSelect, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })
        })
    }


    async updateCategory(id, newCategory) {
        return new Promise((resolve, reject) => {
            let sqlSelect = 'SELECT * FROM Category';
            let sqlUpdate = `UPDATE category
                             SET CategoryName = N'${newCategory.categoryName}'
                             WHERE CategoryId = ${id}`
            this.conn.query(sqlUpdate, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })
        })
    }
    async countProduct(id){
        return new Promise((resolve, reject) => {
            let sqlSelect = `SELECT COUNT(productId) as 'number' FROM product inner join category on product.productCategoryId = category.CategoryId group by category.CategoryId having category.CategoryId = ${id}`
            this.conn.query(sqlSelect, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })
        })
    }
    async deleteCategory(id){
        return new Promise((resolve, reject) => {
            let sqlUpdate = `UPDATE Category
                             SET CategoryName = N'${newCategory.categoryName}'
                             WHERE CategoryId = ${id}`
            this.conn.query(sqlUpdate, (err, data) => {
            let sqlDelete = `DELETE from category where CategoryID = ${id}`
            this.conn.query(sqlDelete, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })
        })
    });
}
    async createCategory(newCategory){
        return new Promise((resolve, reject) => {
            let sqlCreate = `INSERT INTO Category(CategoryName)  value(N'${newCategory.categoryName}')`
            this.conn.query(sqlCreate, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })
        })
    }
}

module.exports = CategoryModel;