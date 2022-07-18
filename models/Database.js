const mysql = require('mysql')

class Database{
    constructor() {
    }
        connect(){
        return mysql.createConnection({
            'host': 'localhost',
            'user': 'root',
            'password' : '',
            'database' : 'shopping_web',
            'charset': 'utf8_general_ci'
        })
    }
}


module.exports = Database;