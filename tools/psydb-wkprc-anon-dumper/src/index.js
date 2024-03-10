'use strict';
var { Dumper } = require('@mpieva/psydb-anon-dumper-core');
var schemas = require('./record-schemas');
var anonymizer = require('./anonymizers');

var config = require('./config');
var cachedir = fspath.join(__dirname, '.field-cache');

co(async () => {
    var dumper = Dumper({ config, cachedir, schemas, anonymizers  });

    await dumper.updateFieldCache();
    await dumper.checkSchemas();
    await dumper.checkAnonymizers();
    await dumper.dump();
})
