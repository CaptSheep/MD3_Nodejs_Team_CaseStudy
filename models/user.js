const Database = require('./Database');

module.exports = class User {
    constructor() {
        this.conn = Database.connect();

    }
    checkAccount(email, password) {
        return new Promise((resolve, reject) => {
            let sql = `select customerEmail, customerPassword,roleId from Customer , RoleCustomerDetails where customerEmail = '${email}' and customerPassword = '${password}'`
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
            let sql = `INSERT INTO Customer (customerId, customerUserName, password, address, roleId,image)  VALUES('${data.name}','${data.email}','${data.password}','${data.address}',${data.roleId},'${data.image}')`
            this.conn.query(sql, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })

        })
    }
}