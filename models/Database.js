const mysql = require('mysql')

class Database{
    constructor() {
    }
    static connect(){
        return mysql.createConnection({
            'host': 'localhost',
            'user': 'root',
            'port': '3306',
            'password' : '1MasterChef*',
            'database' : 'shopping_web',
        })
    }
}


module.exports = Database;