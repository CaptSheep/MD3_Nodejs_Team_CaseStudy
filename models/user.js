const Database = require('./Database');
// const authController = require('../controllers/authController')
const qs = require('qs')
const fs = require('fs');
const isEmpty = require('is-empty');
const fs = require("fs");

module.exports = class User {
    constructor() {
        this.conn = Database.connect();
    }
    rules = [
        {
          key: 'email',
          value: this.email ? this.email.trim() : '',
          rules: 'required|min_length[6]|max_length[32]|email',
        },
        {
          key: 'password',
          value: this.password ? this.password.trim() : '',
          rules: 'required|min_length[6]|max_length[15]',
        },
      ];
    checkAccount(email, password) {
        return new Promise((resolve, reject) => {
            let sql = `select Customer.customerEmail, Customer.customerPassword,RoleCustomerDetails.roleId from Customer  join RoleCustomerDetails on Customer.customerId =  RoleCustomerDetails.customerId where customerEmail = '${email}' and customerPassword = '${password}'`
        });
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

    async createAccount(data) {
        return new Promise((resolve, reject) => {
            let sql = `CALL createAccount('${data.customerUserName}','${data.customerPassword}','${data.customerName}','${data.customerPhone}','${data.customerEmail}','${data.customerAddress}')`
    createAccount(data) 
        console.log(data)
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
)};


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

    async updateUser(id, user) {
        return new Promise((resolve, reject) => {
            let sqlUpdate = `UPDATE Customer SET customerUserName = '${user.customerUserName}', customerPassword = '${user.customerPassword}', customerName = '${user.customerName}', customerPhone = '${user.customerPhone}',customerEmail = '${user.customerEmail}',customerAddress = '${user.customerAddress}' WHERE customerId = ${id};
`
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
            let sqlDelete = `call deleteAccount(${id})`
            this.conn.query(sqlDelete, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })
        })
    }
    checkRole(id){
        return new Promise((resolve, reject) => {
            let sqlSelect = `SELECT roleName FROM rolecustomer inner join rolecustomerdetails on rolecustomer.roleId = rolecustomerdetails.roleId where customerId = ${id}`
            this.conn.query(sqlSelect, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })
        })
    }

    async changeRole(id, role){
        return new Promise((resolve, reject) => {
            let sqlUpdate = ``
            this.conn.query(sqlSelect, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })
        })
    }
    
}