'use strict';
var moveProcessedMail = (cliOptions) => async (context, next) => {
    var { dry = false, dryNoMoveMails = false } = cliOptions;
    var { imap, mail } = context;

    if (dry || dryNoMoveMails) {
        console.log(`DRY: Skipped moving of processed Mail`);
    }
    else {
        await imap.messageMove(mail.uid, 'PUBLIC_REGISTRATION_DONE', {
            uid: true
        });
    }
}

module.exports = { moveProcessedMail }
