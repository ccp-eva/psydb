'use strict';
var debug = require('debug')('psydb:api-message-handlers');
var nodemailer = require('nodemailer');
var config = require('@mpieva/psydb-api-config');
var {
    compose, switchComposition,
    ApiError,
} = require('@mpieva/psydb-api-lib');

var compose_executeRemoteEffects = () => compose([
    maybeSendPasswordMail,
]);

var maybeSendPasswordMail = async (context, next = noop) => {
    var { db, message, cache } = context;
    var { sendMail = true, props } = message.payload;
    var {
        gdpr: { emails },
        scientific: { canLogIn }
    } = props;
    
    var { generatedPassword } = cache.get();

    // XXX this handling is hacky
    var remoteErrors = [];


    var recipient = getRecipientMail(emails);
    if (sendMail && canLogIn && recipient) {
        try {
            var transport = nodemailer.createTransport({
                ...config.smtp
            });

            await transport.sendMail({
                from: 'psydb-noreply@eva.mpg.de',
                to: recipient,
                subject: 'PsyDB - Account',
                text: `Password: ${generatedPassword}`,
            })
        }
        catch (e) {
            // XXX: addRemoteError()
            remoteErrors.push(
                new ApiError(700, {
                    apiStatus: 'SmtpDelegationFailed',
                    data: { originalMessage: e.message }
                })
            )
        }
    }

    // XXX should not be in cache
    cache.merge({ remoteErrors });

    await next();
}

// TODO: redundant
var getRecipientMail = (emails) => {
    if (!Array.isArray(emails)) {
        return;
    }

    var filtered = emails.filter(it => it.isPrimary);
    if (filtered.length < 1) {
        return;
    }
    else {
        return filtered[0].email;
    }
}

module.exports = {
    executeRemoteEffects: compose_executeRemoteEffects()
}
