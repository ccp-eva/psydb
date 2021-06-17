'use strict';
var {
    ExactObject,
    DefaultBool,
    Id,
    EventId,
    ForeignId,
    IdentifierString,
    Integer,
} = require('@mpieva/psydb-schema-fields');

var {
    ExternalLocationGrouping,
} = require('@mpieva/psydb-schema-fields-special');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var FullSchema = ({
    subjectRecordTypeScientificFields,
}) => {
    return Message({
        type: `study/add-subject-type`,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownEventId: EventId(),
                customRecordType: IdentifierString(),

                enableOnlineTesting: DefaultBool(),
                subjectsPerExperiment: Integer({
                    default: 1,
                    minimum: 1
                }),
                externalLocationGrouping: ExternalLocationGrouping({
                    subjectRecordTypeScientificFields,
                }),
            },
            required: [
                'id',
                'lastKnownEventId',
                'customRecordType',
                //'enableOnlineTesting',
                //'subjectsPerExperiment',
                //'externalLocationGrouping',
            ]
        })
    });
}

module.exports = FullSchema;
