'use strict';
var compose = require('koa-compose');
var {
    withGeneralErrorHandling,
    withImapClient,
    withPsydbDriver,
    forEachMail,

    fetchResearchGroupsFromPsydb,
    fetchHelperSetsFromPsydb,
    maybeSetupImapFolders,
    fetchMails,
    parseMailHtml,
    remapMailData,
    createSubjectsInPsydb,

    moveProcessedMail,
    maybeMoveErroneousMails,
} = require('./stages');



var Composition = (cliOptions) => {
    var c = compose([
        withGeneralErrorHandling(cliOptions),
        withImapClient(cliOptions),
        withPsydbDriver(cliOptions),
  
        fetchResearchGroupsFromPsydb,
        fetchHelperSetsFromPsydb,
        maybeSetupImapFolders,
        fetchMails,

        forEachMail([
            parseMailHtml,
            remapMailData,
            createSubjectsInPsydb(cliOptions),
            moveProcessedMail(cliOptions)
        ]),

        maybeMoveErroneousMails(cliOptions),
    ]);

    return c;
}

module.exports = Composition;
