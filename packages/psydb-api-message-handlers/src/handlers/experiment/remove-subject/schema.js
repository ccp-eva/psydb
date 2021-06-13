'use strict';

var {
    ExactObject,
    Id,
    EventId,
    ForeignId,
    ParticipationStatus,
    FullText,
    DateOnlyServerSide
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var UnparticipateStatus = ({ ...additionalKeywords } = {}) => {
    var schema = ParticipationStatus({ ...additionalKeywords });
    
    var enum = [],
        enumNames = [];
    for (var [index, it] of schema.enum) {
        var shouldUse = (
            [
                'canceled-by-participant',
                'canceled-by-institute',
                'deleted-by-institute'
            ].includes(it)
        );
        if (shouldUse) {
            enum.push(it);
            enumNames.push(schema.enumNames[index]);
        }
    }

    schema.enum = enum;
    schema.enumNames = enumNames;

    return schema;
}

var createSchema = ({} = {}) => (
    Message({
        type: `experiment/remove-subject`,
        payload: ExactObject({
            properties: {
                experimentId: ForeignId({
                    collection: 'experiment',
                }),
                lastKnownExperimentEventId: EventId(),
                
                subjectId: ForeignId({
                    collection: 'subject',
                }),
                lastKnownSubjectEventId: EventId(),

                unparticipateStatus: UnparticipateStatus(),
                experimentComment: FullText(),
                subjectComment: FullText(),
                blockSubjectFromTestingUntil: DateOnlyServerSide()
            },
            required: [
                'experimentId',
                'lastKnownExperimentEventId',
                'subjectId',
                'lastKnownSubjectEventId',
                
                'unparticipateStatus',
                'experimentComment',
                'subjectComment',
                //'blockSubjectFromTestingUntil',
            ]
        })
    })
)

module.exports = createSchema;
