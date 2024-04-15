'use strict';
var moveProcessedMail = async (context, next) => {
    var { imap, mail } = context;

    await imap.messageMove(mail.uid, 'PUBLIC_REGISTRATION_DONE', {
        uid: true
    });
}

module.exports = { moveProcessedMail }
