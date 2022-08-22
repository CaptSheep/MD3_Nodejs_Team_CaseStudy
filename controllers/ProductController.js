let ProductModel = require('../models/ProductModel')
let CategoryModel = require('../models/CategoryModel')
let ImageModel = require('../models/ImageModel')
const fs = require("fs");
const qs = require('qs');
const formidable = require("formidable");

class ProductController {
    constructor() {
        this.productModel = new ProductModel();
        this.categoryModel = new CategoryModel();
        this.imageModel = new ImageModel();
    }

    showAllProduct(req, res) {

        this.productModel.getAllProduct().then(products => {
            fs.readFile('./views/admin/product/product.html', 'utf-8', async (err, data) => {
                if (err) {
                    console.log(err)
                }
                let html = '';
                let htmlcategories;
                for (const product of products) {
                    const index = products.indexOf(product);
                    htmlcategories = `<select class="custom-select" name="productCategoryId">`;
                    await this.categoryModel.getAllCategory().then(categories => {
                        categories.forEach(category => {
                            if (product.productCategoryId === category.CategoryId) {
                                htmlcategories += `<option value="${product.productCategoryId}" selected>${category.CategoryName}</option>`
                            } else {
                                htmlcategories += `<option value="${category.CategoryId}">${category.CategoryName}</option>`
                            }

                        })
                    })
                    let img;
                    await this.imageModel.getOneImageByProductId(product.productId).then(image => {
                        img = image[0].imageLink;
                    })
                    htmlcategories += `</select>`
                    let canDelete;
                    await this.productModel.checkDelete(product.productId).then(result=>{
                        canDelete = result.length <= 0;
                    });
                    if (product.productStatus !== '0') {
                        html += `<tr class="alert" role="alert">   
                                    <div class="modal fade" id="edit-${index}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                        
                                            <div class="modal-header">
                                                <h5>Update product</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                    <form action="/product/update?id=${product.productId}" method="POST" enctype="multipart/form-data">
                                                  <div class="form-group">
                                                    <label for="name">Product Name</label>
                                                    <input type="text" name="productName" class="form-control" value="${product.productName}">
                                                  </div>
                                                  <div class="form-group">
                                            <label for="imgInp">Image</label>
                                            <br>
                                            <input accept="image/*" type='file' id="imgInp" name="imageLink"
                                                   onchange="preview(this, 'product-${index}')"/>
                                                   
                                            <br>
                                            <img style="width: 150px !important; height: 150px !important;" id="product-${index}" src="../assets/images/products/${product.imageLink}" alt="your image"/>

                                        </div>
                                                  
                                                  <div class="form-group">
                                                    <label for="category">Category Name</label>
                                                    ${htmlcategories}
                                                  </div>
                                                  <div class="form-group">

                                                    <label for="price">Price</label>
                                                    <input type="text" name="productPrice" class="form-control" value="${product.productPrice}">
                                                  </div> 
                                                  <div class="form-group">
                                                        <label for="quanlity">Quantity</label>
                                                    <input type="text" name="productQuantity" class="form-control" value="${product.productQuantity}">
                                                  </div> <div class="form-group">
                                                        <label for="description">Description</label>
                                                    <input type="text" name="productDescription" class="form-control" value="${product.productDescription}"> 
                                                    </div>                                                 
                                                  <div class="form-group">
                                                    <label for="statucs">Status</label>
                                                        <select class="form-control" name="productStatus">
                                                          <option>${product.productStatus === 1 ? 'Active' : 'In Active'}</option>
                                                          <option>${product.productStatus !== 1 ? 'Active' : 'In Active'}</option>
                                                        </select>
                                                    </div>
                                                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                                  <button type="submit" class="btn btn-primary">Save</button>
                                                </form>
                                            </div>
                                           
                                        </div>
                                    </div>
                                </div>                                
                                <div class="modal fade" id="delete-${index}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog" role="document">
                                        <div class="modal-content">                                        
                                            <div class="modal-header">
                                                <h5>Delete product</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                    <form action="/product/delete?id=${product.productId}" method="POST">
                                                      <div class="form-group">
                                                        <label for="name" ${!canDelete?'hidden':''}>You want to delete product: ${product.productName}?</label>
                                                        <label for="name" ${canDelete?'hidden':''}>You can't delete product: ${product.productName}?</label>
                                                      </div>
                                                  <div class="form-group">
                                            
                                                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                                  <button type="submit" class="btn btn-danger" ${!canDelete?'hidden':''}>Delete</button>
                                                </form>
                                            </div>
                                           
                                        </div>
                                    </div>
                                </div>
                                
                                                                                     
                                <td class="border-bottom-0"><span>${index + 1}</span></td>
                                <td class="border-bottom-0"><image src="../assets/images/products/${product.imageLink}"></image></td>                         
                                <td class="border-bottom-0"><span>${product.productName}</span></td>
                                <td class="border-bottom-0"><span>${product.CategoryName}</span></td>
                                <td class="border-bottom-0"><span>${product.productPrice}</span></td>
                                <td class="border-bottom-0"><span>${product.productQuantity}</span></td>
                                <td class="border-bottom-0"><span>${product.productDescription}</span></td>
                                <td class="status"><span class="${product.productStatus === 1 ? 'active' : 'waiting'} ">${product.productStatus === 1 ? 'Active' : 'In Active'}</span></td>
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
                            </tr>`
                    }
                }
                data = data.replace('{list-product}', html);
                data = data.replaceAll('{htmlcategories}', htmlcategories);
                res.writeHead(200, 'Success', {'Content-type': 'text/html'});
                res.write(data);
                res.end();
            })

        })

    }

    async updateProduct(req, res, id) {
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
                if(product.imageLink !== ''){
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
            if(product.imageLink !== ''){
                this.imageModel.updateImageByProductID(id, product.imageLink).then(()=>{

                })
            }

            res.writeHead(301, {Location: '/product'});
            res.end();
        })


    }
    async deleteProduct(req, res, id) {

        this.productModel.deleteProduct(id).then(result => {
            res.writeHead(301, {Location: '/product'});
            res.end();
        })


    }

    async createProduct(req, res) {
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

    async searchProduct(req, res) {
        let buffer = [];
        for await (const chunk of req) {
            buffer.push(chunk);
        }
        const data = Buffer.concat(buffer).toString();
        const productSearch = qs.parse(data);
        this.productModel.getAllProduct().then(products => {
            fs.readFile('./views/admin/product/product.html', 'utf-8', async (err, data) => {
                if (err) {
                    console.log(err)
                }
                let html = '';
                let htmlcategories;
                for (const product of products) {
                    const index = products.indexOf(product);
                    htmlcategories = `<select class="custom-select" name="productCategoryId">`;
                    await this.categoryModel.getAllCategory().then(categories => {
                        categories.forEach(category => {
                            if (productSearch.productCategoryId == category.CategoryId) {
                                htmlcategories += `<option value="${product.productCategoryId}" selected>${category.CategoryName}</option>`
                            } else {
                                htmlcategories += `<option value="${category.CategoryId}">${category.CategoryName}</option>`
                            }

                        })
                    })
                    let img;
                    await this.imageModel.getOneImageByProductId(product.productId).then(image => {
                        img = image[0].imageLink;
                    })
                    htmlcategories += `</select>`
                    if (product.productStatus !== '0' && product.productName.includes(productSearch.productName) && product.productCategoryId == productSearch.productCategoryId) {
                        html += `<tr class="alert" role="alert">   
                                    <div class="modal fade" id="edit-${index}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                        
                                            <div class="modal-header">
                                                <h5>Update product</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                    <form action="/product/update?id=${product.productId}" method="POST" enctype="multipart/form-data">
                                                  <div class="form-group">
                                                    <label for="name">Product Name</label>
                                                    <input type="text" name="productName" class="form-control" value="${product.productName}">
                                                  </div>
                                                  <div class="form-group">
                                            <label for="imgInp">Image</label>
                                            <br>
                                            <input accept="image/*" type='file' id="imgInp" name="imageLink"
                                                   onchange="preview(this)" value="../assets/images/products/${product.imageLink}"/>
                                                   
                                            <br>
                                            <img style="width: 150px !important; height: 150px !important;" id="blah" src="../assets/images/products/${product.imageLink}" alt="your image"/>

                                        </div>
                                                  
                                                  <div class="form-group">
                                                    <label for="category">Category Name</label>
                                                    ${htmlcategories}
                                                  </div>
                                                  <div class="form-group">

                                                    <label for="price">Price</label>
                                                    <input type="text" name="productPrice" class="form-control" value="${product.productPrice}">
                                                  </div> 
                                                  <div class="form-group">
                                                        <label for="quanlity">Quantity</label>
                                                    <input type="text" name="productQuantity" class="form-control" value="${product.productQuantity}">
                                                  </div> <div class="form-group">
                                                        <label for="description">Description</label>
                                                    <input type="text" name="productDescription" class="form-control" value="${product.productDescription}"> 
                                                    </div>                                                 
                                                  <div class="form-group">
                                                    <label for="statucs">Status</label>
                                                        <select class="form-control" name="productStatus">
                                                          <option>${product.productStatus === 1 ? 'Active' : 'In Active'}</option>
                                                          <option>${product.productStatus !== 1 ? 'Active' : 'In Active'}</option>
                                                        </select>
                                                    </div>
                                                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                                  <button type="submit" class="btn btn-primary">Save</button>
                                                </form>
                                            </div>
                                           
                                        </div>
                                    </div>
                                </div>                                
                                <div class="modal fade" id="delete-${index}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog" role="document">
                                        <div class="modal-content">                                        
                                            <div class="modal-header">
                                                <h5>Delete product</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                    <form action="/product/delete?id=${product.productId}" method="POST">
                                                  <div class="form-group">
                                                    <label for="name">Product Name</label>
                                                    <input type="text" name="productName" class="form-control" value="${product.productName}">
                                                  </div>
                                                  <div class="form-group">
                                            
                                                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                                  <button type="submit" class="btn btn-primary">Save</button>
                                                </form>
                                            </div>
                                           
                                        </div>
                                    </div>
                                </div>
                                
                                                                                     
                                <td class="border-bottom-0"><span>${index + 1}</span></td>
                                <td class="border-bottom-0"><image src="../assets/images/products/${product.imageLink}"></image></td>                         
                                <td class="border-bottom-0"><span>${product.productName}</span></td>
                                <td class="border-bottom-0"><span>${product.CategoryName}</span></td>
                                <td class="border-bottom-0"><span>${product.productPrice}</span></td>
                                <td class="border-bottom-0"><span>${product.productQuantity}</span></td>
                                <td class="border-bottom-0"><span>${product.productDescription}</span></td>
                                <td class="status"><span class="${product.productStatus === 1 ? 'active' : 'waiting'} ">${product.productStatus === 1 ? 'Active' : 'In Active'}</span></td>
                                <td class="border-bottom-0">
                                    <a type="button" class="close" data-toggle="modal" data-target="#edit-${index}">
                                        <span style="color: #0059B3; " aria-hidden="true"><i class="fa fa-edit"></i></span>
                                    </a>
                                </td>
                                <td class="border-bottom-0">
                                    <a type="button" class="close" data-toggle="modal" data-target="#delete-${index}">
                                        <span style="color: #0059B3; " aria-hidden="true"><i class="fa fa-upload"></i></span>
                                    </a>
                                </td>
                            </tr>`
                    }
                }
                data = data.replace('{list-product}', html);
                data = data.replaceAll('{htmlcategories}', htmlcategories);
                res.writeHead(200, 'Success', {'Content-type': 'text/html'});
                res.write(data);
                res.end();
            })

        })

    }
}

module.exports = ProductController;