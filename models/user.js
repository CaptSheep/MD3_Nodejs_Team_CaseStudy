const Database = require('./Database');
let emailValidator = require('email-validator')
const authController = require('../controllers/authController')
const qs = require('qs')
const fs = require('fs')
module.exports = class User {
    constructor() {
        this.conn = Database.connect();
    

    }
    rules = [
        {
          key: 'email',
          value: this.email ? this.email.trim() : '',
          rules: 'required|min_length[6]|max_length[32]|email',
        },
        {
          key: 'password',
          value: this.password ? this.password.trim() : '',
          rules: 'required|min_length[6]|max_length[15]',
        },
      ];
    checkAccount(email, password) {
        return new Promise((resolve, reject) => {
            let sql = `select Customer.customerEmail, Customer.customerPassword,RoleCustomerDetails.roleId from Customer  join RoleCustomerDetails on Customer.customerId =  RoleCustomerDetails.customerId where customerEmail = '${email}' and customerPassword = '${password}'`
            this.conn.query(sql, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })
        })
    }
    checkEmail(req,res,datahtml){
        let buffer = [];
        const data = Buffer.concat(buffer).toString();
        const user = qs.parse(data);
        if(emailValidator.validate(user.email)){
          
            throw new Error('Wrong type of Email. Please try again')
        }
        else{
            //  throw Error('Wrong type of Email');
           fs.readFile('./views/auth/register.html', 'utf8', function(err, datahtml) {
                if (err) {
                    console.log(err);
                }
                datahtml = datahtml.replace('{Error}','<p style="color:red ;">Wrong type of Email.Please try again</p>');
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(datahtml);
                return res.end();
            });
        }
        
    }
    createAccount(data) {
        return new Promise((resolve, reject) => {
            let sql = `CALL createAccount('${data.customerUserName}','${data.customerPassword}','${data.customerName}','${data.customerPhone}','${data.customerEmail}','${data.customerAddress}')`
            this.conn.query(sql, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })

        })
    }
}