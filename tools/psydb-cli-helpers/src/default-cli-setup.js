'use strict';
var { program } = require('commander');

var defaultCLISetup = (bag) => {
    var {
        version = 'unknown',
        description = '',
        usage = '',
        opts = []
    } = bag;

    program
        .version(version)
        .description('some description')
        .usage('some usage')

    for (var it of opts) {
        program.option(...it)
    }

    program.parse(process.argv);

    return program;
}

module.exports = defaultCLISetup;
