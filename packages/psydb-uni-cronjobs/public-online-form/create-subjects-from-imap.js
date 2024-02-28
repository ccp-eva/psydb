'use strict';
var co = require('co');
var debug = require('debug')('psydb:uni-cronjobs');

var cli = require('./cli-setup');
var compose = require('koa-compose');

var withErrorHandling = require('./with-error-handling');
var withImapClient = require('./with-imap-client');
var withPsydbDriver = require('./with-psydb-driver');

var fetchHelperSetsFromPsydb = require('./fetch-helper-sets-from-psydb');
var maybeSetupImapFolders = require('./maybe-setup-imap-folders');

var fetchMails = require('./fetch-mails');
var parseMailHtml = require('./parse-mail-html');
var remapMailData = require('./remap-mail-data');

var createSubjectsInPsydb = require('./create-subjects-in-psydb');

var noop = async () => {};

co(async () => {
    var cliOptions = cli.opts();
    var {
        psydbApiKey,
        psydbUrl,
        psydbVerbose,

        imapHost,
        imapPort,
        imapUser,
        imapPassword,
        imapSsl,
        imapVerbose,

        errorSmtpHost,
        errorSmtpPort,
        errorRecepient,

        ...extraOptions
    } = cliOptions;

    var context = {
        parserErrors: [],
        psydbDriverErrors: [],
    };
    await compose([
        withErrorHandling(cliOptions),
        withImapClient(cliOptions),
        withPsydbDriver(cliOptions),
        
        fetchHelperSetsFromPsydb,
        
        maybeSetupImapFolders,

        fetchMails,
        parseMailHtml,
        remapMailData,

        createSubjectsInPsydb,
    ])(context, noop);

}).catch(error => { console.log(error) });
