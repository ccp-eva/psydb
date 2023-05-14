'use strict';
var co = require('co');
var { program } = require('commander');
var pkg = require('../package.json');
var execute = require('./execute-with-driver');

program
    .version(pkg.version)
    .description('some description')
    .usage('some usage')

var cliOptions = [
    {
        long: 'api-key',
        arg: 'apiKey',
        description: 'api key to authenticate with',
    },
    {
        long: 'url',
        arg: 'url',
        description: 'psydb url',
        defaults: 'http://127.0.0.1:8080',
    },
    {
        long: 'mongodb',
        arg: 'mongodbConnectString',
        description: 'mongodb connect string; some scripts require that',
        defaults: 'mongodb://127.0.0.1:47017/psydb',
    }
];

for (var it of cliOptions) {
    var {
        long,
        short,
        arg,
        description,
        defaults,
        parse = (x) => (x)
    } = it;

    short = short ? `-${short}, ` : '';
    long = `--${long}`;
    arg = arg ? ` <${arg}>` : '';

    var def = `${short}${long}${arg}`;
    program.option(
        def,
        description,
        parse,
        defaults
    )
}

program.parse(process.argv);

co(async () => {
    var scripts = [];
    for (var it of program.args) {
        scripts.push(require(it));
    }

    var { url, apiKey, ...extraOptions } = program.opts();

    for (var it of scripts) {
        await execute({
            url, apiKey, extraOptions,
            script: it
        });
    }
}).catch(error => { console.log(error) });
