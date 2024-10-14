'use strct';
var { program } = require('commander');
var pkg = require('../package.json');

var cwd = process.cwd();

program
    .version(pkg.version)
    .description('some description')
    .usage('some usage')

var cliOptions = [
    {
        long: 'config',
        short: 'c',
        arg: 'path',
        description: 'a config file to load',
    },
    {
        long: 'out-path',
        short: 'o',
        arg: 'path',
        description: 'output path where we will dump',
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
