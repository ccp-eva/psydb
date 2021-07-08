'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:searchSubjectsTestableInhouse'
);
var compose = require('koa-compose');
var searchUngrouped = require('./search-ungrouped');

var searchSubjectsTestableInhouse = compose([
    async (context, next) => {
        context.experimentVariant = 'inhouse';
        await next();
    },
    searchUngrouped
]);

module.exports = searchSubjectsTestableInhouse;
