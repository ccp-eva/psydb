'use strict';
var { createId } = require('@mpieva/psydb-api-lib');
var injectCommentsIntoSubjects = require(
    '../../csv-import/subject-contact-history/create/inject-comments-into-subjects'
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

    var { dev_injectContactHistoryCommentIntoSubject: injectComments = false }
        = apiConfig;
    if (injectComments) {
        await injectCommentsIntoSubjects({
            db, dispatchProps, timezone,
            items: [{ parts: { _id, core, state }}],
            options: injectComments,
        });
    }

    cache.merge({ subjectContactHistoryId: _id });
}

module.exports = { executeSystemEvents }
