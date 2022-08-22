let UserModel = require('../models/user');
const fs = require("fs");
const qs = require('qs');
const formidable = require("formidable");

class ProductController {
    constructor() {
        this.userModel = new UserModel();
    }

    showAllUser(req, res) {
        this.userModel.getAllUser().then(users => {
            fs.readFile('./views/admin/user/list.html', 'utf-8', async (err, data) => {
                if (err) {
                    console.log(err)
                }

                let html = '';
                for (const user of users) {
                    const index = users.indexOf(user);
                    // let canDelete;
                    // await this.productModel.checkDelete(product.productId).then(result=>{
                    //     canDelete = result.length <= 0;
                    // });
                    html += `<tr class="alert" role="alert">      
                                <td class="border-bottom-0"><span>${index + 1}</span></td>                        
                                <td class="border-bottom-0"><span>${user.customerUserName}</span></td>
                                <td class="border-bottom-0"><span>${user.customerName}</span></td>
                                <td class="border-bottom-0"><span>${user.customerPhone}</span></td>
                                <td class="border-bottom-0"><span>${user.customerEmail}</span></td>
                                <td class="border-bottom-0"><span>${user.customerAddress}</span></td>
                                <td class="border-bottom-0"><span>
                                <a type="button" class="button-42" role="button" data-toggle="modal" data-target="#role-${index}">
                                   <span class="change">Change Role User</span>    
                                </a>
                                    </span></td>
                                <td class="border-bottom-0">
                                    <a type="button" class="close" data-toggle="modal" data-target="#edit-${index}">
                                        <span style="color: #0059B3; " aria-hidden="true"><i class="fa fa-edit"></i></span>
                                    </a>
                                </td>
                                <td class="border-bottom-0">
                                    <a type="button" class="close" data-toggle="modal" data-target="#delete-${index}">
                                        <span style="color: #eb4034; " aria-hidden="true"><i class="fa fa-close"></i></span>
                                    </a>
                                </td>
                            </tr>`;
                    await this.showFormChangeRole(index, user).then(result=>{
                        html += result;
                    });
                    await this.showFormUpdate(index, user).then(result=>{
                        html += result;
                    });
                    html += await this.showFormDelete(index, user);
                }
                data = data.replace('{create}', this.showFormCreate());
                data = data.replace('{list-user}', html);
                res.writeHead(200, 'Success', {'Content-type': 'text/html'});
                res.write(data);
                res.end();


            })

        })

    }

    async showFormUpdate(index, user) {
        let update = fs.readFileSync('./views/admin/user/edit.html', {encoding: 'utf-8'});
        update = update.replace('{option}', `edit-${index}`)
        update = update.replace('{username}', `${user.customerUserName}`)
        update = update.replace('{password}', `${user.customerPassword}`)
        update = update.replace('{name}', `${user.customerName}`)
        update = update.replace('{phone}', `${user.customerPhone}`)
        update = update.replace('{email}', `${user.customerEmail}`)
        update = update.replace('{address}', `${user.customerAddress}`)
        update = update.replace('{param}', `${user.customerId}`)
        return update;
    }

    async showFormChangeRole(index, user) {
        let role = fs.readFileSync('./views/admin/user/role.html', {encoding: 'utf-8'});
        role = role.replace('{option}', `role-${index}`);
        await this.userModel.checkRole(user.customerId).then(results => {
            results.forEach(item => {
                if (item.roleName === 'ADMIN') {
                    role = role.replace('{admin}', `checked`);
                } else if (item.roleName === 'USER') {
                    role = role.replace('{admin}', ``);
                    role = role.replace('{user}', `checked`);
                } else {
                    role = role.replace('{user}', ``);
                }
            })
        });
        return role;

    }

    showFormCreate() {
        return fs.readFileSync('./views/admin/user/create.html', {encoding: 'utf-8'});
    }

    async showFormDelete(index, user) {
        let delete1 = fs.readFileSync('./views/admin/user/delete.html', {encoding: 'utf-8'});
        delete1 = delete1.replace('{option}', `delete-${index}`)
        delete1 = delete1.replace('{user}', `${user.customerName}`);
        delete1 = delete1.replace('{param}', `${user.customerId}`);
        return delete1;

    }

    async updateUser(req, res, id) {
        let buffer = [];
        for await (const chunk of req) {
            buffer.push(chunk);
        }
        const data = Buffer.concat(buffer).toString();
        const user = qs.parse(data);
        this.userModel.updateUser(id, user).then(result => {
            res.writeHead(301, {Location: '/user'});
            res.end();
        });
    }

    async deleteUser(req, res, id) {

        this.userModel.deleteUser(id).then(result => {
            res.writeHead(301, {Location: '/user'});
            res.end();
        })


    }

    async createUser(req, res) {
        let buffer = [];
        for await (const chunk of req) {
            buffer.push(chunk);
        }
        const data = Buffer.concat(buffer).toString();
        const user = qs.parse(data);
        this.userModel.createAccount(user).then(result => {
            res.writeHead(301, {Location: '/user'});
            res.end();
        });
    }

    async changeRole(req, res, id) {
        let buffer = [];
        for await (const chunk of req) {
            buffer.push(chunk);
        }
        const data = Buffer.concat(buffer).toString();
        const role = qs.parse(data);
        buffer = [];
        role.roleUser ? buffer.push('USER') : '';
        role.roleAdmin ? buffer.push('ADMIN') : '';
        console.log(buffer)
    }

}

module.exports = ProductController;