'use strict';
var debug = require('debug')('psydb:humankind-cronjobs:maybeMoveErroneousMails');
var maybeMoveErroneousMails = (cliOptions) => async (context, next) => {
    var { dry = false, dryNoMoveMails = false } = cliOptions;
    var { imap, caughtErrors } = context;
    
    if (caughtErrors.length > 0) {
        var mailUIDs = [];
        for (var { mail, e } of caughtErrors) {
            mailUIDs.push(mail.uid);
        }

        if (dry || dryNoMoveMails) {
            console.log(
                `DRY: Skipped moving of ${mailUIDs.length} erroneous Mails`
            );
            debug('UIDs', mailUIDs);
        }
        else {
            await imap.messageMove(mailUIDs, 'PUBLIC_REGISTRATION_ERRORS', {
                uid: true
            });
        }
    }
}

module.exports = { maybeMoveErroneousMails }
