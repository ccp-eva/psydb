'use strict';
var maybeSetupImapFolders = async (context, next) => {
    var { imap } = context;

    var folders = (
        await imap.list()
    ).map(it => it.path);

    var required = [
        'PUBLIC_REGISTRATION_ERRORS',
        'PUBLIC_REGISTRATION_DONE',
    ]
    for (var it of required) {
        if (!folders.includes(it)) {
            await imap.mailboxCreate([ it ]);
        }
    }
    
    await next();
}

module.exports = { maybeSetupImapFolders }
