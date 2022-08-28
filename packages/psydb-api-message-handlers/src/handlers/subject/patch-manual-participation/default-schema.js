'use strict';
var enums = require('@mpieva/psydb-schema-enums');

var {
    ExactObject,
    OpenObject,
    Id,
    EventId,
    ForeignId,
    ForeignIdList,
    IdentifierString,
    DateTime,
    ParticipationStatus,
    StringEnum,
    CustomRecordTypeKey,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    var requiredProps = {
        participationId: Id(),
        labProcedureType: StringEnum(
            enums.experimentVariants.keys
        ),
        subjectId: ForeignId({
            collection: 'subject',
        }),
        studyId: ForeignId({
            collection: 'study',
        }),
        locationId: ForeignId({
            collection: 'location'
        }),
        experimentOperatorIds: ForeignIdList({
            collection: 'experimentOperatorIds',
            minItems: 1,
        }),
        timestamp: DateTime(),
        status: ParticipationStatus(),
        excludeFromMoreExperimentsInStudy: DefaultBool(),
    };
    var requiredKeys = Object.keys(requiredProps);
    
    return Message({
        type: `subject/patch-manual-participation`,
        payload: OpenObject({
            properties: {
                ...requiredProps,
            },
            required: [
                ...requiredKeys,
            ],
        }),
    });
}

module.exports = Schema;
