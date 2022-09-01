'use strict';
var fs = require('fs');
var fspath = require('path');

var compose = require('koa-compose');
var Router = require('koa-router');


var serve = ({ bundlePath, file }) => async (context, next) => {
    //console.log(fspath.join(bundlePath, file ))
    
    context.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    context.set('Pragma', 'no-cache');
    context.set('Expires', 0);

    context.type = 'html';
    context.body = fs.readFileSync(fspath.join(bundlePath, file));

    await next();
}

var withIndexHtmlRoute = ({ bundlePath }) => {
    var router = Router();

    router.get('/', serve({ bundlePath, file: 'index.html' }))

    return compose([
        router.routes(),
        router.allowedMethods()
    ]);
};

module.exports = withIndexHtmlRoute;
