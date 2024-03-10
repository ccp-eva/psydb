'use strict';
var { merge } = require('@mpieva/psydb-core-utils');
var {
    withDefaultCLI,
    asCommanderOpts,
    opts,
} = require('@mpieva/psydb-cli-helpers');

var { Dumper } = require('@mpieva/psydb-anon-dumper-core');

var schemas = require('./record-schemas');
var anonymizers = require('./record-anonymizers');
var baseConfig = require('./config');

withDefaultCLI(async (bag) => {
    var { cli } = bag;
    console.log(cli.opts)
    var { mongodbUrl, cacheDir } = cli.opts;

    var cliConfig = {
        mongodb: { url: mongodbUrl },
        cachedir: cacheDir
    }
    
    var dumper = Dumper({
        config: merge(baseConfig, cliConfig),
        schemas, anonymizers 
    });

    await dumper.updateFieldCache();
    await dumper.checkSchemas();
    //await dumper.checkAnonymizers();
    //await dumper.dump();
}, {
    version: '0.0.0',
    description: 'some description',
    usage: 'some usage',
    cliOptions: [
        ...opts.mongodb(),
        ...asCommanderOpts([{
            long: 'cache-dir',
            arg: 'cachedir',
            description: 'directory where field cache is stored',
            defaults: '/tmp/psydb-wkprc-anon-dumper-field-cache',
        }])
    ]
});
