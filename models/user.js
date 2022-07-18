const Database = require('./Database');

module.exports = class User {
    constructor() {
        this.db = new Database
        this.conn = this.db.connect();

    }
    checkAccount(email, password) {'         l'
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
}