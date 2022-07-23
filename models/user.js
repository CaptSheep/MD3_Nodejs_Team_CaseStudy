const Database = require('./Database');

module.exports = class User {
    constructor() {
        this.conn = Database.connect();

    }
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
    createAccount(data) {
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