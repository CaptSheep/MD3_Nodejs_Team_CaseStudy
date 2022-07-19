const http = require('http');
const url = require('url');
const fs = require('fs')
const qs = require('qs');
const AuthController = require('./controllers/authController')

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
handlers.notfound = (req, res)=>{
    fs.readFile('./views/auth/notfound.html', 'utf-8', (err, data)=>{
        if(err)
            console.log(err);
        res.writeHead(200, 'Success', {'Content-type':'text/html'});
        res.write(data);
        res.end();
    })
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

const router = {
    '/login' : handlers.login,
    '/' : handlers.home
}