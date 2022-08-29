const fs = require('fs')
const qs = require('qs')
const User = require('../models/user')
const Validate = require('../models/Validate')
const dom = require('xmldom')

const cookie = require('cookie')


class AuthController {
    constructor() {
        this.userModel = new User()
        this.validate = new Validate()
    }

    showForm(req, res, pathFile) {
        fs.readFile(pathFile, 'utf-8', (err, data) => {
            if (err) {
                throw new Error(err.message);
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data);
                res.end();
            }
        })
    }
    async login(req, res) {
     const buffer = [];
        for await (const chunk of req) {
            buffer.push(chunk);
        }
        const data = Buffer.concat(buffer).toString();
        const user = qs.parse(data);
        // let admin = ''

        let result = await this.userModel.checkAccount(user.email, user.password)
        result = JSON.parse(JSON.stringify(result))
        console.log(result);
        if (result.length > 0) {

            let nameFile = Date.now();
            let sessionLogin = {
                'session_name_file': nameFile,
                'data_user_login': result[0]
            }
            fs.writeFile('./session' + nameFile + '.txt', JSON.stringify(sessionLogin), err => {
                if (err) {
                    throw new Error(err.message);
                }
            })

            let cookieLogin = {
                id: result[0].id,
                'session_name_File': nameFile
            }

            console.log(cookieLogin)
            let admin = false;
            res.setHeader('set-cookie', cookie.serialize('cookie-app', JSON.stringify(cookieLogin)));

            result.forEach(item=> {
                if (item.roleId === 1) {
                    admin = true;
                    res.writeHead(301, { Location: '/product' });
                    return res.end();
                }
            })
            if (!admin) {
                let login = '<li class="menu-item" ><a title="Register or Login" href="/login">Login</a></li>';
                let register = '<li class="menu-item" ><a title="Register or Login" href="/login">Register</a></li>';
                let loginParse = new dom.DOMParser().parseFromString(login,'text/xml');
                let registerParse = new dom.DOMParser().parseFromString(register,'text/xml');
                let loginOutput = loginParse.getElementsByTagName('<li class="menu-item" ><a title="Register or Login" href="/login">Login</a></li>')[0]
                let registerOutput = registerParse.getElementsByTagName('<li class="menu-item" ><a title="Register or Login" href="/login">Login</a></li>')[0]
        
                fs.readFile('./views/auth/home.html','utf-8',(err,datahtml)=>{
                    if(err){
                        throw new Error(err.message)
                    }
                datahtml = datahtml.replace(loginOutput,`${user.customerName}`)
                datahtml = datahtml.replace(registerOutput,"")
                res.writeHead(301, { Location: '/' },{'Content-Type': 'text/html'});
                res.write(datahtml);
                return res.end();
                })
                
            }
            else {
            res.writeHead(301, { Location: '/login' });
            return res.end();
        }
        
    }
}
     async register(req, res) {
        let buffer = [];
        for await (const chunk of req) {
            buffer.push(chunk);
        }
        const data = Buffer.concat(buffer).toString();
        const user = qs.parse(data);
        this.validate.validate(req,res,user.customerEmail, user.customerName,user.customerPassword,user.customerAddress,user.customerPhone).then((err, ress)=>{
            if(err){
                this.userModel.createAccount(user).then(result => {
                    res.writeHead(301, { Location: '/login' });
                    res.end();
                });
            }
            
        })
    }
    }

module.exports = AuthController