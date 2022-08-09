const Database = require('./Database');
const fs = require("fs");

module.exports = class User {
    constructor() {
        this.conn = Database.connect();

    }

    checkAccount(email, password) {
        return new Promise((resolve, reject) => {
            let sql = `select customerEmail, customerPassword,roleId from Customer  join rolecustomerdetails r on customer.customerId = r.customerId where customerEmail = '${email}' and customerPassword = '${password}'`
            this.conn.query(sql, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })
        })
    }
    createAccount(data) {
        return new Promise((resolve, reject) => {
            let sql = `call createAccount('${data.customerUserName}','${data.customerPassword}','${data.customerName}','${data.customerPhone}','${data.customerEmail}','${data.customerAddress}')`;
            this.conn.query(sql, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })

        })
    }


    async getAllUser() {
        return new Promise((resolve, reject) => {
            let sqlSelect = 'SELECT * FROM customer';
            this.conn.query(sqlSelect, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })
        })
    }

   // Not done
    async updateUser(id, newCategory) {
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
    async deleteUser(id){
        return new Promise((resolve, reject) => {
            let sqlDelete = `DELETE from category where CategoryID = ${id}`
            this.conn.query(sqlDelete, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })
        })
    }
    async createUser(newCategory){
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