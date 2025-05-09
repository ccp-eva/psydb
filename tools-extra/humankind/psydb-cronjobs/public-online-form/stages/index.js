module.exports = {
    ...require('./with-general-error-handling'),
    ...require('./with-imap-client'),
    ...require('./with-psydb-driver'),
    ...require('./for-each-mail'),

    ...require('./fetch-research-groups-from-psydb'),
    ...require('./fetch-helper-sets-from-psydb'),
    ...require('./maybe-setup-imap-folders'),

    ...require('./fetch-mails'),
    ...require('./parse-mail-html'),
    ...require('./remap-mail-data'),

    ...require('./create-subjects-in-psydb'),

    ...require('./move-processed-mail'),
    ...require('./maybe-move-erroneous-mails'),
}
