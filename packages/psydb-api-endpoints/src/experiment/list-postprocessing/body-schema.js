'use strict';
var { ClosedObject, ForeignId, CustomRecordTypeKey, DateTimeInterval }
    = require('@mpieva/psydb-schema-fields');

var BodySchema = () => {
    var schema = ClosedObject({
        'labMethod': { type: 'string', enum: [
            'inhouse', 'away-team', 'online-video-call'
        ]},
        'subjectType': CustomRecordTypeKey({ collection: 'subject' }),
        'researchGroupId': ForeignId({
            collection: 'researchGroup',
        }),
    });

    return schema;
}

module.exports = BodySchema;
