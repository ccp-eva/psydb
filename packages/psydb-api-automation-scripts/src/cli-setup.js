'use strict';
var { program } = require('commander');
var pkg = require('../package.json');

var cwd = process.cwd();

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
        defaults: 'http://127.0.0.1:8080/api/',
    },
    {
        long: 'mongodb',
        arg: 'mongodbConnectString',
        description: 'mongodb connect string; some scripts require that',
        defaults: 'mongodb://127.0.0.1:47017/psydb',
    },
    {
        long: 'restore-fixture',
        arg: 'fixturePath',
        description: 'fixture to restore before running script',
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

module.exports = program;
