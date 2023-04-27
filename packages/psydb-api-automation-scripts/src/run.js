'use strict';
var co = require('co');
var config = require('@mpieva/psydb-api-config');
var executeWithDriver = require('./execute-with-driver');

var url = process.argv[1];
var scriptpath = process.argv[2];
var script = require(scriptpath);

co(() => execute({
    url,
    script
})).catch(error => { console.log(error) });
