'use strict';
var debug = require('debug')('psydb:api-lib:two-factor-authentication');
var nodemailer = require('nodemailer');

var { range } = require('@mpieva/psydb-core-utils');
var config = require('@mpieva/psydb-api-config');
var withRetracedErrors = require('../with-retraced-errors');

var generateAndSendCode = async (bag) => {
    var { db, personnelId, recipientEmail } = bag;
    
    var code = range(6).map(R10).join('');
    debug('code:', code);

    await withRetracedErrors(
        db.collection('twoFactorAuthCodes').updateOne(
            { personnelId },
            { $set: { personnelId, code }},
            { upsert:  true }
        )
    );
    
    try {
        if (recipientEmail) {
            var { senderEmail, ...transportConfig } = config.smtp;
            var transport = nodemailer.createTransport({
                ...transportConfig
            });

            await transport.sendMail({
                from: senderEmail,
                to: recipientEmail,
                subject: `PsyDB - Two-Factor Code: ${code}`,
                text: `Code: ${code}`,
            })
        }
        debug('mail send to:', recipientEmail);
    }
    catch (e) {
        console.error('Could not send 2FA mail:', e.message);
    }
}

var getRandomIntInclusive = (min, max) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    // The maximum is inclusive and the minimum is inclusive
    return Math.floor(
        Math.random() * (maxFloored - minCeiled + 1) + minCeiled
    );
}

var R10 = () => getRandomIntInclusive(0,9);

module.exports = generateAndSendCode;
