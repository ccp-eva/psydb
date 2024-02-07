var co = require('co');
var debug = require('debug')('psydb:uni-cronjobs');

var { program } = require('commander');
var { ImapFlow } = require('imapflow');
var pkg = require('../package.json');

var cwd = process.cwd();

program
    .version(pkg.version)
    .description('some description')
    .usage('some usage')

var cliOptions = [
    {
        long: 'psydb-api-key',
        arg: 'psydbApiKey',
        description: 'api key to authenticate with psydb',
    },
    {
        long: 'psydb-url',
        arg: 'psydbUrl',
        description: 'psydb url',
        defaults: 'http://127.0.0.1:8080/api/',
    },
    {
        long: 'psydb-verbose',
        description: 'enable verbose psydb driver logging',
        defaults: false
    },
    {
        long: 'imap-host',
        arg: 'imapHost',
        description: 'imap hostname or ip',
        defaults: '127.0.0.1'
    },
    {
        long: 'imap-port',
        arg: 'imapPort',
        description: 'imap port',
        defaults: '143'
    },
    {
        long: 'imap-user',
        arg: 'imapUser',
        description: 'imap login user',
    },
    {
        long: 'imap-password',
        arg: 'imapPassword',
        description: 'imap login user',
    },
    {
        long: 'imap-ssl',
        description: 'use ssl for imap connection',
        defaults: false
    },
    {
        long: 'imap-verbose',
        description: 'enable verbose imap logging',
        defaults: false
    },
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
    var options = program.opts();
    var {
        apiKey,
        psydbUrl,
        psydbVerbose,

        imapHost,
        imapPort,
        imapUser,
        imapPassword,
        imapSsl,
        imapVerbose,

        ...extraOptions
    } = options;

    var client = new ImapFlow({
        host: imapHost,
        port: imapPort,
        secure: imapSsl,
        logger: imapVerbose,
        auth: {
            user: imapUser,
            pass: imapPassword
        }
    });

    await client.connect();

    var lock = await client.getMailboxLock('INBOX');
    try {
        var fetched = client.fetch('1:*', { envelope: true });
        for await (var message of fetched) {
            console.log(`${message.uid}: ${message.envelope.subject}`);
        }
    }
    finally {
        lock.release();
    }
    
    await client.logout();
}).catch(error => { console.log(error) });
