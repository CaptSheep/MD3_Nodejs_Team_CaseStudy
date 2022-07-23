const mysql = require('mysql')

class Database{
    constructor() {
    }
    static connect(){
        return mysql.createConnection({
            'host': 'localhost',
            'user': 'root',
            'password' : '123456',
            'database' : 'clothingsalesmanager'
        })
    }
}


module.exports = Database;