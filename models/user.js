const Database = require('./Database');

module.exports = class User {
    constructor() {
        this.conn = Database.connect();

    }
    checkAccount(email, password) {
        return new Promise((resolve, reject) => {
            let sql = `select customerEmail, customerPassword,roleId from Customer  inner join RoleCustomerDetails on Customer.customerId =  RoleCustomerDetails.roleId where customerEmail = '${email}' and customerPassword = '${password}'`
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
            let sql = `INSERT INTO Customer ( customerUserName, customerPassword, customerName, customerPhone,customerEmail,customerAddress)  VALUES('${data.customerUserName}','${data.customerPassword}','${data.customerName}',${data.customerPhone},'${data.customerEmail}','${data.customerAddress}')`
            this.conn.query(sql, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })

        })
    }
}