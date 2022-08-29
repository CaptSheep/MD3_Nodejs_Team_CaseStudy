const isEmpty = require("is-empty");
const qs = require('qs');
const fs = require('fs')

 class Validate {

    constructor(){

    }
    validate(req,res,email,name,password,address,phoneNumber){
        return new Promise((reject, resolve)=>{
        let mailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        let validEmail = mailRegexp.test(email)
        let nameRegexp = /^[A-Za-z\s]+$/;
        let validName = nameRegexp.test(name)
        let phoneNumberRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        let validPhoneNumber = phoneNumberRegex.test(phoneNumber)
        let valid = true;
            fs.readFile('./views/auth/register.html', 'utf-8', function(err, datahtml) {
                    if (err) {
                        reject(err);
                    }
                    if(isEmpty(email) && isEmpty(name) && isEmpty(password) && isEmpty(address) && isEmpty(phoneNumber)){
                    datahtml = datahtml.replace('<span hidden>{email}</span>','<p style="color:red ;">Email required</p>');
                    datahtml = datahtml.replace('<span hidden>{name}</span>','<p style="color:red ;">Name required</p>');
                    datahtml = datahtml.replace('<span hidden>{userName}</span>','<p style="color:red ;">User Name required</p>');
                    datahtml = datahtml.replace('<span hidden>{password}</span>','<p style="color:red ;">Password required</p>');
                    datahtml = datahtml.replace('<span hidden>{address}</span>','<p style="color:red ;">Address required</p>');
                    datahtml = datahtml.replace('<span hidden>{phone}</span>','<p style="color:red ;">Phone Number required</p>');
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(datahtml);
                    res.end();
                    return reject(false)
                }
                if(!validEmail && !validPhoneNumber){
                    if(password.length < 6 || phoneNumber.length > 10 ){
                        datahtml = datahtml.replace('<span hidden>{password}</span>','<p style="color:red ;">Password must be over 6 characters </p>');
                        datahtml = datahtml.replace('<span hidden>{phone}</span>','<p style="color:red ;">Phone Number must be under 10 characters </p>');
                    }
                    if(!validName){

                        datahtml = datahtml.replace('<span hidden>{name}</span>','<p style="color:red ;">Name can not have number</p>');
                        datahtml = datahtml.replace('<span hidden>{userName}</span>','<p style="color:red ;">User Name can not have number</p>');
                            
                    }
                    datahtml = datahtml.replace('<span hidden>{email}</span>','<p style="color:red ;">Wrong type of Email.Please try again</p>');
                    datahtml = datahtml.replace('<span hidden>{phone}</span>','<p style="color:red ;">Phone Number can not includes string characters .Please try again</p>');

                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(datahtml);
                    res.end();
                    return reject(false)
                }
                reject(valid)
            });
            })
    }

}
module.exports = Validate