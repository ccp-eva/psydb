'use strict';
var co = require('co');
var defaultCLISetup = require('./default-cli-setup');

var withDefaultCLI = (fn, bag = {}) => {
    var { version, description, usage, cliOptions, ...pass } = bag;

    var cli = defaultCLISetup({
        version, description, usage, opts: cliOptions
    });

    co(async () => {
        await fn({
            cli: {
                opts: cli.opts(),
                args: cli.args,
                cwd: process.cwd()
            },
            ...pass
        })
    }).catch(e => {
        console.log(e); process.exit(1);
    })
}
module.exports = withDefaultCLI;
