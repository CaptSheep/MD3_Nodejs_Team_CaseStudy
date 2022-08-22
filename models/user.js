const Database = require('./Database');
// const authController = require('../controllers/authController')
const qs = require('qs')
const fs = require('fs');
const isEmpty = require('is-empty');

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
            this.conn.query(sql, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })

        })
    }
}