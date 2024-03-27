'use strict';
var nodemailer = require('nodemailer');
var { encode: encodeHtml } = require('html-entities');

var sendErrorMail = async (bag) => {
    var { cliOptions, caughtErrors } = bag;
    var {
        smtpHost, smtpPort, smtpSsl, smtpUser, smtpPassword,
        errorMailFrom, errorMailTo, errorMailVerbose = false
    } = cliOptions;

    var items = caughtErrors.map(({ mail, e }) => {
        var html = `
            <p>${encodeHtml(String(e))}</p>
        `;

        if (mail) {
            var mailInfo = `
                in mail from
                "${mail.replyTo[0].name} <${mail.replyTo[0].address}>"
                received at "${mail.date.toISOString()} UTC"
                (MessageId: "${mail.messageId}")
            `;
            html += `<p>${encodeHtml(mailInfo)}</p>`;
        }

        if (errorMailVerbose) {
            var stack = (
                (e.stack || '').split("\n").slice(1).join("\n")
            );
            html += `<pre>${encodeHtml(stack)}</pre>`;
        }

        return html;
    });

    var html = `
        <html><body>
            <p><b>
                Errors occured while parsing online registration mails:
            </b></p>
            <ol>
                ${items.map(it => (
                    `<li>${it}</li>`
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

    await transport.sendMail({
        from: errorMailFrom,
        to: errorMailTo,
        subject: 'PsyDB - Online Registration Errors',
        text: '',
        html
    })
}

module.exports = { sendErrorMail }
