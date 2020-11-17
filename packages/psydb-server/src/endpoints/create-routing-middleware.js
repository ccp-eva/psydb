'use strict';
var fs = require('fs'),
    fspath = require('fspath');

var createMiddleware = (config) => {
    var basepath = fspath.join(__dirname, '..', 'endpoints', 'routers'),
        files = fs.readDirSync(basepath),

        routing = [];

    files
        .filter(filename => (
            /\.js$/.test(filename)
            && !/\.spec\.js$/.test(filename)
        ))
        .forEach(filename => {
            var path = fspath.join(basedir, filename)
                Router = require(path),
                instance = Router(config);

            routing.push(instance.routes())
            routing.push(instance.allowedMethods())
        });

    return compose(routing);
}

module.exports = createMiddleware;
