const mysql = require('mysql')

class Database{
    constructor() {
    }
    static connect(){
        return mysql.createConnection({
            'host': '127.0.0.1',
            'user': 'newUser',
            'password' : 'shmily',
            'database' : 'ClothingSalesManager'
        })
    }
}


module.exports = Database;