const http = require('http');
const url = require('url');
const fs = require('fs')
const qs = require('qs');
const AuthController = require('./controllers/authController')
const ProductController = require('./controllers/ProductController');
const CategoryController = require("./controllers/CategoryController");
const UserController = require("./controllers/UserController");
let productController = new ProductController();
let categoryController = new CategoryController();
let userController = new UserController();

handlers = {};

let authController = new AuthController()
handlers.login = (req,res)=>{
    if(req.method === 'GET'){
        authController.showForm(req,res,'./views/auth/login.html')
    }
    else{
        authController.login(req,res)
    }
}
handlers.register = (req,res)=>{
    if(req.method ==='GET'){
        authController.showForm(req,res,'./views/auth/register.html')
    }
    else{
        authController.register(req,res)
    }
}
handlers.home = (req,res)=>{
    if(req.method === 'GET'){
        authController.showForm(req,res,'./views/auth/home.html')
    }
}

handlers.products = (req, res)=>{
    productController.showAllProduct(req, res);
};
handlers.product_update = (req, res)=>{
    let queryUrl = url.parse(req.url).query;
    let id = qs.parse(queryUrl).id;
    productController.updateProduct(req, res, id);
};
handlers.product_delete = (req, res)=>{
    let queryUrl = url.parse(req.url).query;
    let id = qs.parse(queryUrl).id;
    productController.deleteProduct(req, res, id);
};
handlers.product_create = (req, res)=>{
    productController.createProduct(req, res);
}
handlers.notfound = (req, res)=>{
    fs.readFile('./views/notfound.html', 'utf-8', (err, data)=>{
        if(err)
            console.log(err);
        res.writeHead(200, 'Success', {'Content-type':'text/html'});
        res.write(data);
        res.end();
    })
};
handlers.category = (req, res)=>{
    categoryController.showAllCategory(req, res);
}
handlers.category_update = (req, res)=>{
    let queryUrl = url.parse(req.url).query;
    let id = qs.parse(queryUrl).id;
    categoryController.updateCategory(req, res, id);
}
handlers.category_create = (req, res)=>{
    let queryUrl = url.parse(req.url).query;
    let id = qs.parse(queryUrl).id;
    categoryController.createCategory(req, res);
}
handlers.category_delete = (req, res)=>{
    let queryUrl = url.parse(req.url).query;
    let id = qs.parse(queryUrl).id;
    categoryController.deleteCategory(req, res, id);
}
handlers.search = (req, res)=>{
    productController.searchProduct(req, res);
}

handlers.users = (req, res)=>{
    userController.showAllUser(req, res);
}
handlers.user_update = (req, res)=>{
    let queryUrl = url.parse(req.url).query;
    let id = qs.parse(queryUrl).id;
    userController.updateUser(req, res, id);
}
handlers.user_create = (req, res)=>{
    let queryUrl = url.parse(req.url).query;
    let id = qs.parse(queryUrl).id;
    userController.createUser(req, res);
}
handlers.user_delete = (req, res)=>{
    let queryUrl = url.parse(req.url).query;
    let id = qs.parse(queryUrl).id;
    userController.deleteUser(req, res, id);
}
handlers.user_role = (req, res)=>{
    let queryUrl = url.parse(req.url).query;
    let id = qs.parse(queryUrl).id;
    userController.changeRole(req, res, id);
}
handlers.product_user = (req, res)=>{
    productController.showAllProductUser(req,res);
}
handlers.sortProductDesc = (req,res)=>{
    productController.sortProductDesc(req,res);
}
handlers.sortProductASC = (req,res)=>{
    productController.sortProductASC(req,res);
}
handlers.sortProductName = (req,res)=>{
    productController.sortProductName(req,res);
}
handlers.getDetailProduct = (req,res)=> {
    productController.getDetailProductById(req,res);
}
router = {
    '/product' : handlers.products,
    '/product/update' : handlers.product_update,
    '/product/delete' : handlers.product_delete,
    '/product/create': handlers.product_create,
    '/login' : handlers.login,
    '/' : handlers.home,
    '/register': handlers.register,
    '/category' : handlers.category,
    '/category/update' : handlers.category_update,
    '/category/create' : handlers.category_create,
    '/category/delete' : handlers.category_delete,
    '/product/search' : handlers.search,
    '/user': handlers.users,
    '/user/update' : handlers.user_update,
    '/user/create' : handlers.user_create,
    '/user/delete' : handlers.user_delete,
    '/user/role' : handlers.user_role,
    '/userproduct':handlers.product_user,
    '/userproduct/sortdesc':handlers.sortProductDesc,
    '/userproduct/sortasc':handlers.sortProductASC,
    '/userproduct/sortname':handlers.sortProductName,
    '/productDetail':handlers.getDetailProduct
}


let mimeTypes={
    '/login' : handlers.login,
    '/' : handlers.home,
    '/register': handlers.register,
    'jpg' : 'images/jpg',
    'png' : 'images/png',
    'js' :'text/javascript',
    'css' : 'text/css',
    'svg':'image/svg+xml',
    'ttf':'font/ttf',
    'woff':'font/woff',
    'woff2':'font/woff2',
    'eot':'application/vnd.ms-fontobject'
}
const server = http.createServer(async(req, res)=>{
    let urlPath = url.parse(req.url).pathname;
    const filesDefences = urlPath.match(/\.js|\.css|\.png|\.svg|\.jpg|\.ttf|\.woff|\.woff2|\.eot/);
    if (filesDefences) {
        const extension = mimeTypes[filesDefences[0].toString().split('.')[1]];
        res.writeHead(200, {'Content-Type': extension});
        fs.createReadStream(__dirname  + req.url).pipe(res)
    } else{
        let chosenHandler = (typeof (router[urlPath]) !== 'undefined') ? router[urlPath] : handlers.notfound;
        chosenHandler(req, res);
    }

})

server.listen(8081, 'localhost', ()=>{
    console.log("Server is running on http://localhost:8081");
})



