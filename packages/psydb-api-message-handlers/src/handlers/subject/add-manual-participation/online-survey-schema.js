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
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    var requiredProps = {
        labProcedureType: StringEnum(
            enums.experimentVariants.keys
        ),
        subjectIds: ForeignIdList({
            collection: 'subject',
        }),
        studyId: ForeignId({
            collection: 'study',
        }),
        timestamp: DateTime(),
        status: ParticipationStatus(),
    };
    var requiredKeys = Object.keys(requiredProps);
 
    return Message({
        type: `subject/add-manual-participation`,
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
