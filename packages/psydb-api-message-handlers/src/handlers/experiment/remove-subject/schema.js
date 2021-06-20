'use strict';
var debug = require('debug')('psydb:api:message-handlers');
var enums = require('@mpieva/psydb-schema-enums');

var {
    ExactObject,
    Id,
    EventId,
    ForeignId,
    ParticipationStatus,
    UnparticipationStatus,
    FullText,
    DateOnlyServerSide,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var {
    BlockFromTesting
} = require('@mpieva/psydb-schema-fields-special');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({} = {}) => (
    Message({
        type: `experiment/remove-subject`,
        payload: ExactObject({
            properties: {
                experimentId: ForeignId({
                    collection: 'experiment',
                }),
                //lastKnownExperimentEventId: EventId(),
                
                subjectId: ForeignId({
                    collection: 'subject',
                }),
                //lastKnownSubjectScientificEventId: EventId(),

                unparticipateStatus: UnparticipationStatus(),
                //experimentComment: FullText(),
                subjectComment: FullText(),
                blockSubjectFromTesting: BlockFromTesting()
            },
            required: [
                'experimentId',
                //'lastKnownExperimentEventId',
                'subjectId',
                //'lastKnownSubjectScientificEventId',
                
                'unparticipateStatus',
                //'experimentComment',
                'subjectComment',
                'blockSubjectFromTesting',
            ]
        })
    })
)

module.exports = createSchema;
