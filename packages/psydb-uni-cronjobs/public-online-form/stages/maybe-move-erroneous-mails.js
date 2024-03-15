'use strict';
var maybeMoveErroneousMails = async (context, next) => {
    var { imap, caughtErrors } = context;

    var mailUIDs = [];
    for (var e of caughtErrors) {
        var mail = e.getExtraInfo?.()?.mail;
        if (mail) {
            mailUIDs.push(mail.uid);
        }
    }

    await imap.messageMove(mailUIDs, 'PUBLIC_REGISTRATION_ERRORS', {
        uid: true
    });
}

module.exports = { maybeMoveErroneousMails }
