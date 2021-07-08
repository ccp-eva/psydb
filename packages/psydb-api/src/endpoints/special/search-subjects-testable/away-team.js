'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:searchSubjectsTestableViaAwayTeam'
);
var compose = require('koa-compose');
var searchGrouped = require('./search-grouped');

var searchSubjectsTestableViaAwayTeam = compose([
    async (context, next) => {
        context.experimentVariant = 'away-team';
        await next();
    },
    searchGrouped
]);

module.exports = searchSubjectsTestableViaAwayTeam;
