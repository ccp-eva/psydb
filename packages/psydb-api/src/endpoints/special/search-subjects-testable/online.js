'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:searchSubjectsTestableOnline'
);
var compose = require('koa-compose');
var searchUngrouped = require('./search-ungrouped');

var searchSubjectsTestableOnline = compose([
    async (context, next) => {
        context.experimentVariant = 'online';
        await next();
    },
    searchUngrouped
]);

module.exports = searchSubjectsTestableOnline;
