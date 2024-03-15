'use strict';

var fetchMails = async (context, next) => {
    var { imap } = context;

    var lock = await imap.getMailboxLock('INBOX');
    try {
        var fetched = imap.fetch(
            { subject: '[DB-Registration]' },
            { envelope: true, bodyStructure: true, bodyParts: [ '2' ] }
        );
        
        var preprocessedMails = [];
        for await (var message of fetched) {
            var { seq, uid, id, envelope, bodyParts } = message;
            var {
                subject, date, messageId, sender, from, replyTo
            } = envelope;

            // NOTE: imap search is very limited see:
            // https://github.com/postalsys/imapflow/issues/154
            if (!/^\[DB-Registration\]/.test(subject)) {
                continue;
            }

            var htmlPart = String(bodyParts.get('2'));

            preprocessedMails.push({
                seq,
                uid,
                id,
                date,
                messageId,
                sender,
                from,
                replyTo,
                htmlPart
            });
        }
    
        context.mails = preprocessedMails;
    }
    finally {
        lock.release();
    }

    await next();
}

module.exports = { fetchMails }
