'use strict';

var {
    ExactObject,
    ForeignId,
    CustomRecordTypeKey,
    DateTimeInterval,
} = require('@mpieva/psydb-schema-fields');

var BodySchema = () => ExactObject({
    properties: {
        locationType: CustomRecordTypeKey({ collection: 'location' }),
        researchGroupId: ForeignId({ collection: 'researchGroup' }),
        interval: DateTimeInterval(),
        
        studyId: ForeignId({ collection: 'study' }),
        experimentType: {
            type: 'string',
            enum: ['inhouse', 'online-video-call', 'away-team'],
        },
    },
    required: [
        'locationType',
        'researchGroupId',
        'experimentType',
        'interval',
    ]
});

module.exports = BodySchema;
