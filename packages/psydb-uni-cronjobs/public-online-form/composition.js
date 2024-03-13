'use strict';
var compose = require('koa-compose');

var withGeneralErrorHandling = require('./with-general-error-handling');
var withImapClient = require('./with-imap-client');
var withPsydbDriver = require('./with-psydb-driver');
var forEachMail = require('./for-each-mail');

var fetchHelperSetsFromPsydb = require('./fetch-helper-sets-from-psydb');
var maybeSetupImapFolders = require('./maybe-setup-imap-folders');

var fetchMails = require('./fetch-mails');
var parseMailHtml = require('./parse-mail-html');
var remapMailData = require('./remap-mail-data');

var createSubjectsInPsydb = require('./create-subjects-in-psydb');


var Composition = (cliOptions) => {
    var c = compose([
        withGeneralErrorHandling(cliOptions),
        withImapClient(cliOptions),
        withPsydbDriver(cliOptions),
        
        fetchHelperSetsFromPsydb,
        maybeSetupImapFolders,
        fetchMails,

        forEachMail([
            parseMailHtml,
            remapMailData,

            //createSubjectsInPsydb,
        ]),

        //maybeMoveErroneousMails,
    ]);

    return c;
}

module.exports = Composition;
