const mysql = require('mysql')

class Database{
    constructor() {
    }
    static connect(){
        return mysql.createConnection({
            'host': 'localhost',
            'user': 'root',
            'password' : 'shmily',
            'database' : 'clothingsalesmanager'
        })
    }
}


module.exports = Database;