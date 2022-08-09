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
                    html += this.showFormUpdate(index, user);
                    html += this.showFormDelete(index, user);
                }
                data = data.replace('{create}', this.showFormCreate());
                data = data.replace('{list-user}', html);
                res.writeHead(200, 'Success', {'Content-type': 'text/html'});
                res.write(data);
                res.end();


            })

        })

    }
    showFormUpdate(index, user){
        let update = fs.readFileSync('./views/admin/user/edit.html', {encoding:'utf-8'});
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
    showFormCreate(){
        return fs.readFileSync('./views/admin/user/create.html', {encoding:'utf-8'});
    }
    showFormDelete(index, user){
        let delete1 = fs.readFileSync('./views/admin/user/delete.html', {encoding:'utf-8'});
        delete1 = delete1.replace('{option}', `delete-${index}`)
        delete1 = delete1.replace('{user}', `${user.customerName}`);
        return delete1;
    }
    // not done
    async updateUser(req, res, id) {
        let form = new formidable.IncomingForm();
        form.uploadDir = "assets/images/products/";

        const product = await new Promise((resolve, reject) => {
            form.parse(req, function (err, fields, files) {
                if (err) {
                    reject(err.message);
                }
                let product = {
                    productName: fields.productName,
                    productCategoryId: fields.productCategoryId,
                    productPrice: fields.productPrice,
                    productQuantity: fields.productQuantity,
                    productDescription: fields.productDescription,
                    productStatus: fields.productStatus,
                    imageLink: files.imageLink.originalFilename
                }
                if (product.imageLink !== '') {
                    let tmpPath = files.imageLink.filepath;
                    let newPath = form.uploadDir + files.imageLink.originalFilename;
                    fs.readFile(newPath, (err) => {
                        if (err) {
                            fs.rename(tmpPath, newPath, (err) => {
                                if (err) throw err;
                            });
                        }
                    })

                }
                resolve(product);
            });
        })
        this.productModel.updateProductById(product, id).then(result => {
            if (product.imageLink !== '') {
                this.imageModel.updateImageByProductID(id, product.imageLink).then(() => {

                })
            }

            res.writeHead(301, {Location: '/product'});
            res.end();
        })


    }

    async deleteUser(req, res, id) {

        this.productModel.deleteProduct(id).then(result => {
            res.writeHead(301, {Location: '/product'});
            res.end();
        })


    }

    async createUser(req, res) {
        let form = new formidable.IncomingForm();
        form.uploadDir = "public/images/admin/";
        const product = await new Promise((resolve, reject) => {
            form.parse(req, function (err, fields, files) {
                if (err) {
                    reject(err.message);
                }
                let product = {
                    productName: fields.productName,
                    productCategoryId: fields.productCategoryId,
                    productPrice: fields.productPrice,
                    productQuantity: fields.productQuantity,
                    productDescription: fields.productDescription,
                    imageLink: files.imageLink.originalFilename
                }
                let tmpPath = files.imageLink.filepath;
                let newPath = form.uploadDir + files.imageLink.originalFilename;
                fs.readFile(newPath, (err) => {
                    if (err) {
                        fs.rename(tmpPath, newPath, (err) => {
                            if (err) throw err;
                        });
                    }
                })
                resolve(product);
            });
        })
        await this.productModel.createProduct(product).then(result => {
            res.writeHead(301, {Location: '/product'});
            res.end();
        })
    }

}

module.exports = ProductController;