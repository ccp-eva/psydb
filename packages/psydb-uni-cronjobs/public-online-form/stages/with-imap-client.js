'use strict';
var { ImapFlow } = require('imapflow');

var withImapClient = (cliOptions) => async (context, next) => {
    var client = undefined;
    try {
        client = new ImapFlow({
            host: cliOptions.imapHost,
            port: cliOptions.imapPort,
            secure: cliOptions.imapSsl,
            logger: cliOptions.imapVerbose,
            auth: {
                user: cliOptions.imapUser,
                pass: cliOptions.imapPassword
            }
        });

        await client.connect();

        context.imap = client;
        await next();
    }
    finally {
        if (client) {
            await client.logout();
        }
    }
}

module.exports = { withImapClient }
