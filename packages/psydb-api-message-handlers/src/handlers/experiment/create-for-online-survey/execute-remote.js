'use strict';
var debug = require('debug')('psydb:api-message-handlers');
var nodemailer = require('nodemailer');
var config = require('@mpieva/psydb-api-config');
var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { compose, switchComposition } = require('@mpieva/psydb-api-lib');

var compose_executeRemoteEffects = () => compose([
    doit,
]);

var doit = async (context, next = noop) => {
    var { db, message, cache } = context;
    var { subjects, mapping } = cache.get();
    var { mailSubject, mailBody } = message.payload;

    var transport = nodemailer.createTransport({
        pool: true,
        ...config.smtp
    });

    debug('sending to', subjects.length);
    try {
        var promises = [];
        for (var [ix, it] of subjects.entries()) {
            var { _emails, ...subjectData } = it;
            var { email } = _emails;

            var thisMailBody = mailBody;
            for (var m of mapping) {
                var { pointer, previewKey } = m;
                thisMailBody = thisMailBody.replace(
                    new RegExp(`\\{\\{${previewKey}\\}\\}`, 'g'),
                    jsonpointer.get(subjectData, pointer)
                );
            }

            promises.push(transport.sendMail({
                from: 'psydb-noreply@eva.mpg.de',
                to: email,
                subject: mailSubject,
                html: thisMailBody
            }))
        }

        await Promise.all(promises);
        debug('done sending');
    }
    finally {
        transport.close();
    }

    await next();
}

module.exports = {
    executeRemoteEffects: compose_executeRemoteEffects()
}
