const mysql = require('mysql')

class Database{
    constructor() {
    }
    static connect(){
        return mysql.createConnection({
            'host': 'localhost',
            'user': 'root',
            'password' : '',
            'database' : ''
        })
    }
}


module.exports = Database;