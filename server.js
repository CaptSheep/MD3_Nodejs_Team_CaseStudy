const http = require('http');
const url = require('url');
const fs = require('fs')
const qs = require('qs');
const AuthController = require('./controllers/authController')
const ProductController = require('./controllers/ProductController');
const CategoryController = require("./controllers/CategoryController");
let productController = new ProductController();
let categoryController = new CategoryController();

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
};
handlers.image_update = (req, res)=>{
    let queryUrl = url.parse(req.url).query;
    let id = qs.parse(queryUrl).id;
    productController.updateImageProduct(req, res, id);
}
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
handlers.search = (req, res)=>{
    productController.searchProduct(req, res);
}
router = {
    '/product' : handlers.products,
    '/product/update' : handlers.product_update,
    '/product/delete' : handlers.product_delete,
    '/product/image/update': handlers.image_update,
    '/product/create': handlers.product_create,
    '/login' : handlers.login,
    '/' : handlers.home,
    '/category' : handlers.category,
    '/category/update' : handlers.category_update,
    '/category/create' : handlers.category_create,
    '/product/search' : handlers.search
}

let mimeTypes={
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
