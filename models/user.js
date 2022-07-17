const Database = require('./Database');

module.exports = class User {
    constructor() {
        this.db = new Database
        this.conn = this.db.connection();

    }
    checkAccount(email, password) {
        return new Promise((resolve, reject) => {
            let sql = `select email, password,roleId from Customer where email = '${email}' and password = '${password}'`
            this.conn.query(sql, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })
        })
    }
}