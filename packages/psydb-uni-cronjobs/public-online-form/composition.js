'use strict';
var compose = require('koa-compose');
var {
    withGeneralErrorHandling,
    withImapClient,
    withPsydbDriver,
    forEachMail,

    fetchHelperSetsFromPsydb,
    maybeSetupImapFolders,
    fetchMails,
    parseMailHtml,
    remapMailData,
    createSubjectsInPsydb,
    maybeMoveErroneousMails
} = require('./stages');



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

        maybeMoveErroneousMails,
    ]);

    return c;
}

module.exports = Composition;
