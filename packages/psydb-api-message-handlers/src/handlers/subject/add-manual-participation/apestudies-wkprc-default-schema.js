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
    SaneString,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    var requiredProps = {
        labProcedureType: StringEnum(
            enums.labMethods.keys,
            { const: 'apestudies-wkprc-default' }
        ),
        subjectIds: ForeignIdList({
            collection: 'subject',
        }),
        studyId: ForeignId({
            collection: 'study',
        }),

        timestamp: DateTime(),
        experimentName: SaneString({ minLength: 1 }),

        studyTopicIds: ForeignIdList({
            collection: 'studyTopic',
            minItems: 1,
        }),
        locationId: ForeignId({
            collection: 'location'
        }),
        experimentOperatorIds: ForeignIdList({
            collection: 'experimentOperatorIds',
            minItems: 1,
        }),
    };
    var requiredKeys = Object.keys(requiredProps);
 
    return Message({
        type: `subject/add-manual-participation`,
        payload: OpenObject({
            properties: {
                ...requiredProps,
                subjectsAreTestedTogether: DefaultBool(),
            },
            required: [
                ...requiredKeys,
            ],
        }),
    });
}

module.exports = Schema;
