'use strict';
var maybeMoveErroneousMails = async (context, next) => {
    var { imap, caughtErrors } = context;
    
    if (caughtErrors.length > 0) {
        var mailUIDs = [];
        for (var { mail, e } of caughtErrors) {
            mailUIDs.push(mail.uid);
        }

        await imap.messageMove(mailUIDs, 'PUBLIC_REGISTRATION_ERRORS', {
            uid: true
        });
    }
}

module.exports = { maybeMoveErroneousMails }
