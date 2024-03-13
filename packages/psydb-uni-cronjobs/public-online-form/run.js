'use strict';
var co = require('co');
var debug = require('debug')('psydb:uni-cronjobs');

var cli = require('./cli-setup');
var Composition = require('./composition');

var noop = async () => {};

co(async () => {
    var cliOptions = cli.opts();
    
    var context = {
        parserErrors: [],
        psydbDriverErrors: [],
    };

    var composition = Composition(cliOptions);
    await composition(context, noop);

}).catch(error => { console.log(error) });
