'use strict';
var { RemapMailError } = require('./errors');

var withErrorHandling = (cliOptions) => async (context, next) => {
    var caughtErrors = [];
    try {
        await next();
    }
    catch (e) {
        caughtErrors.push(e);
    }
    finally {
        await sendErrorMail({
            cliOptions,
            caughtErrors
        });
        // send mail to somewhere
    }
}

var nodemailer = require('nodemailer');
var { encode: encodeHtml } = require('html-entities');
var sendErrorMail = async (bag) => {
    var { cliOptions, caughtErrors } = bag;
    var {
        smtpHost, smtpPort, smtpSsl, smtpUser, smtpPassword,
        errorMailFrom, errorMailTo
    } = cliOptions;

    console.log(caughtErrors);

    var html = `
        <html><body>
            <p><b>
                Errors occured while parsing online registration mails:
            </b></p>
            <ol>
                ${caughtErrors.map(it => (
                    `<li>
                        ${encodeHtml(String(it))}<br/>
                        ${encodeHtml(it.stack)}
                    </li>`
                ))}
            </ol>
        </body></html>
    `;

    var transport = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSsl,
        auth: {
            user: smtpUser,
            pass: smtpPassword
        }
    });

    console.log(errorMailTo);

    await transport.sendMail({
        from: errorMailFrom,
        to: errorMailTo,
        subject: 'PsyDB - Online Registration Errors',
        text: '',
        html
    })
}

module.exports = withErrorHandling;
