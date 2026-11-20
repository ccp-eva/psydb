'use strict';
var { createId } = require('@mpieva/psydb-api-lib');
var appendCommentsToSubjects = require(
    '../../csv-import/subject-contact-history/create/append-comments-to-subjects'
);

var executeSystemEvents = async (context) => {
    var { db, message, cache, apiConfig, dispatchProps } = context;

    var { timezone, payload } = message;
    var { subjectId, props } = payload;
    var { type, contactedAt, contactedBy = null, status, comment } = props;
    var { subject } = cache.get();

    var _id = await createId();
    var core = {
        type, csvImportId: null, experimentId: null,
        subjectId, subjectType: subject.type,
        timezone,
        contactedBy,
        contactedAt,
    };
    var state = { status, comment };

    await dispatchProps({
        collection: 'subjectContactHistory',
        channelId: _id,
        isNew: true,
        additionalChannelProps: core,
        props: state,
        initialize: false, // NOTE no schema currently
    });

    var { dev_appendContactHistoryCommentToSubject: appendComments = false }
        = apiConfig;
    if (appendComments) {
        await appendCommentsToSubjects({
            db, dispatchProps, timezone,
            items: [{ parts: { _id, core, state }}],
            language: appendComments === true ? 'en' : appendComments,
        });
    }

    cache.merge({ subjectContactHistoryId: _id });
}

module.exports = { executeSystemEvents }
