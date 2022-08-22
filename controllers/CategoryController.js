let CategoryModel = require('../models/CategoryModel')

const fs = require("fs");
const qs = require('qs');
const formidable = require("formidable");

class CategoryController {
    constructor() {
        this.categoryModel = new CategoryModel();
    }

    showAllCategory(req, res) {
        this.categoryModel.getAllCategory().then(categories => {
            fs.readFile('./views/admin/category.html', 'utf-8', async (err, data) => {
                if (err) {
                    console.log(err)
                }
                let html = '';
                for (const category of categories) {
                    let count = 0;
                    await this.categoryModel.countProduct(category.CategoryId).then(res=>{
                        if(res.length > 0){
                            count = res[0].number;
                        }
                    })
                    const index = categories.indexOf(category);
                    html += `<tr class="alert" role="alert">   
                                    <div class="modal fade" id="edit-${index}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                        
                                            <div class="modal-header">
                                                <h5>Update category</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                    <form action="/category/update?id=${category.CategoryId}" method="POST">
                                                  <div class="form-group">
                                                    <label for="name">Category Name</label>
                                                    <input type="text" name="categoryName" class="form-control" value="${category.CategoryName}">
                                                  </div>                                                  
                                                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                                  <button type="submit" class="btn btn-primary">Save</button>
                                                </form>
                                            </div>
                                           
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
                                                    <form action="/category/delete?id=${category.CategoryId}" method="POST">
                                                      <div class="form-group">
                                                        <label for="name" ${count ? 'hidden' : ''}>You want to delete product: ${category.CategoryName}?</label>
                                                        <label for="name" ${!count ? 'hidden' : ''}>You can't delete product: ${category.CategoryName}?</label>
                                                      </div>
                                                  <div class="form-group">
                                            
                                                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                                  <button type="submit" class="btn btn-danger" ${count ? 'hidden' : ''}>Delete</button>
                                                </form>
                                            </div>                                           
                                        </div>
                                    </div>
                                </div>
                                
                                
                                                                                     
                                <td class="border-bottom-0"><span>${index + 1}</span></td>
                                <td class="border-bottom-0"><span>${category.CategoryName}</span></td>
                                <td class="border-bottom-0"><span>${count}</span></td>

                               
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

                data = data.replace('{list-category}', html);
                res.writeHead(200, 'Success', {'Content-type': 'text/html'});
                res.write(data);
                res.end();
            })
        })
    }

    async updateCategory(req, res, id) {
        let buffer = [];
        for await (const chunk of req) {
            buffer.push(chunk);
        }
        const data = Buffer.concat(buffer).toString();
        const category = qs.parse(data);

        this.categoryModel.updateCategory(id, category).then(result => {
            res.writeHead(301, {Location: '/category'});
            res.end();
        })
    }

    async createCategory(req, res) {
        let buffer = [];
        for await (const chunk of req) {
            buffer.push(chunk);
        }
        const data = Buffer.concat(buffer).toString();
        const category = qs.parse(data);
        await this.categoryModel.createCategory(category).then(result => {
            res.writeHead(301, {Location: '/category'});
            res.end();
        })
    }
    async deleteCategory(req, res, id) {
        await this.categoryModel.deleteCategory(id).then(result => {
            res.writeHead(301, {Location: '/category'});
            res.end();
        })
    }

}

module.exports = CategoryController;