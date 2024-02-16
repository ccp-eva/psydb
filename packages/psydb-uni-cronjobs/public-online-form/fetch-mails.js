'use strict';

var scanInbox = async (context, next) => {
    var { imap } = context;

    var lock = await imap.getMailboxLock('INBOX');
    try {
        var fetched = imap.fetch(
            { subject: 'Anmeldung Datenbank' },
            { envelope: true, bodyStructure: true, bodyParts: [ '2' ] }
        );
        
        var preprocessedMails = [];
        for await (var message of fetched) {
            var { seq, uid, bodyParts } = message;
            var htmlPart = String(bodyParts.get('2'));

            preprocessedMails.push({ seq, uid, htmlPart });
        }
    
        context.mails = preprocessedMails;
    }
    finally {
        lock.release();
    }

    await next();
}

module.exports = scanInbox;
