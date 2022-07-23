let Database = require('./Database');

class CategoryModel {
    constructor() {
        this.conn = Database.connect();
    }

    async getAllCategory() {
        return new Promise((resolve, reject) => {
            let sqlSelect = 'SELECT * FROM category';
            this.conn.query(sqlSelect, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })
        })
    }

    async getCategoryByName() {
        return new Promise((resolve, reject) => {
            let sqlSelect = 'SELECT * FROM category';
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
    async createCategory(newCategory){
        return new Promise((resolve, reject) => {
            let sqlCreate = `INSERT INTO Category(CategoryName) value(N'${newCategory.categoryName}')`
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