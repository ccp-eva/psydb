'use strict';
var statics = require('koa-static-cache');
var mount = require('koa-mount');

var withStaticContent = (bag) => {
    var { from, toPublic, options } = bag;

    var options = {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        gzip: true,
        usePrecompiledGzip: true,
        ...options
    };

    return mount(
        toPublic,
        statics(from, options)
    );
}

module.exports = withStaticContent;
