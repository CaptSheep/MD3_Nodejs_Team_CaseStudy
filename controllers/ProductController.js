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

    showAllProductUser(req,res){
        this.productModel.getAllProductUser().then(products => {
            fs.readFile('./views/user/product.html', 'utf-8', async (err, data) => {
                if (err) {
                    console.log(err)
                }
                let htmlproduct = "";
                for (const product of products) {
                    const index = products.indexOf(product);
                    htmlproduct += `<li class="col-lg-4 col-md-6 col-sm-6 col-xs-6 "> 
                                                  <div class="product product-style-3 equal-elem "> 
                                                        <div class="product-thumnail"> 
                                                            <a href="#">
                                                                <img src="/assets/images/products/${product.imageLink}" alt="">
                                                         
                                                            </a>
                                                        </div>
                                                        <div class="product-info">
                                                                <a href="#" class="product-name"><span> ${product.productName} </span></a>
                                        
                                                                <div class="wrap-price"><span class="product-price">${product.productPrice}</span></div>
                                                           <a href="#" class="btn add-to-cart">Add To Cart</a>
                                                        </div>
                                                    </div>
                                                </li>`;

                }
                data = data.replace('{productList}', htmlproduct);
                res.writeHead(200, 'Success', {'Content-type': 'text/html'});
                res.write(data);
                res.end();
            })
        })
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
                                                    <form action="/product/update?id=${product.productId}" method="POST">
                                                  <div class="form-group">
                                                    <label for="name">Product Name</label>
                                                    <input type="text" name="productName" class="form-control" value="${product.productName}">
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
                                </div>
                                <div class="modal fade" id="image-${index}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                        
                                            <div class="modal-header">
                                                <h5>Update Image product</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                    <form action="/product/image/update?id=${product.productId}" method="POST" enctype="multipart/form-data">
                                                  <div class="form-group">
                                                    <label for="name">Image</label>
                                                    <input type="file" name="imageLink" class="form-control">
                                                  </div>
                                                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                                  <button type="submit" class="btn btn-primary">Save</button>
                                                </form>
                                            </div>                                           
                                        </div>
                                    </div>
                                </div>
                                </div>
                                
                                                                                     
                                <td class="border-bottom-0"><span>${index + 1}</span></td>
                                <td class="border-bottom-0"><image src="../public/images/admin/${img}"></image></td>                         
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
                                    <a type="button" class="close" data-toggle="modal" data-target="#image-${index}">
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

    async updateProduct(req, res, id) {
        let buffer = [];
        for await (const chunk of req) {
            buffer.push(chunk);
        }
        const data = Buffer.concat(buffer).toString();
        const product = qs.parse(data);
        console.log(product)

        this.productModel.updateProductById(product, id).then(result => {
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
        console.log(product);
        await this.productModel.createProduct(product).then(result => {
            res.writeHead(301, {Location: '/product'});
            res.end();
        })
    }

    async updateImageProduct(req, res, id) {
        let form = new formidable.IncomingForm();
        form.uploadDir = "public/images/admin/";
        const link = await new Promise((resolve, reject) => {

            form.parse(req, function (err, fields, files) {
                if (err) {

                    reject(err.message);
                }
                let tmpPath = files.imageLink.filepath;
                let newPath = form.uploadDir + files.imageLink.originalFilename;

                fs.rename(tmpPath, newPath, (err) => {
                    if (err) throw err;
                });
                resolve(files.imageLink.originalFilename);
            });
        })
        await this.imageModel.updateImageByProductID(id, link).then(result => {
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
                                console.log(category.CategoryName)
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
                                                    <form action="/product/update?id=${product.productId}" method="POST">
                                                  <div class="form-group">
                                                    <label for="name">Product Name</label>
                                                    <input type="text" name="productName" class="form-control" value="${product.productName}">
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
                                </div>
                                <div class="modal fade" id="image-${index}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog" role="document">
                                        <div class="modal-content">

                                            <div class="modal-header">
                                                <h5>Update Image product</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                    <form action="/product/image/update?id=${product.productId}" method="POST" enctype="multipart/form-data">
                                                  <div class="form-group">
                                                    <label for="name">Image</label>
                                                    <input type="file" name="imageLink" class="form-control">
                                                  </div>
                                                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                                  <button type="submit" class="btn btn-primary">Save</button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>


                                <td class="border-bottom-0"><span>${index + 1}</span></td>
                                <td class="border-bottom-0"><image src="../public/images/admin/${img}"></image></td>
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
                                    <a type="button" class="close" data-toggle="modal" data-target="#image-${index}">
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