'use strict';
var nodemailer = require('nodemailer');
var { encode: encodeHtml } = require('html-entities');

var sendErrorMail = async (bag) => {
    var { cliOptions, caughtErrors } = bag;
    var {
        smtpHost, smtpPort, smtpSsl, smtpUser, smtpPassword,
        errorMailFrom, errorMailTo, errorMailVerbose = false
    } = cliOptions;

    console.log(caughtErrors);

    var html = `
        <html><body>
            <p><b>
                Errors occured while parsing online registration mails:
            </b></p>
            <ol>
                ${caughtErrors.map(it => (
                    errorMailVerbose
                    ? `
                        <li>
                            <p>
                                ${encodeHtml(String(it))}
                            </p>
                            <pre>${
                                encodeHtml(it.stack.split("\n")
                                .slice(1).join("\n"))
                            }</pre>
                        </li>
                        <hr />
                    `
                    : `<li>${encodeHtml(String(it))}</li>`
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

module.exports = sendErrorMail;
