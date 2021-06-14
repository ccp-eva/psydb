'use strict';

var {
    ExactObject,
    Id,
    EventId,
    ForeignId,
    ParticipationStatus,
    FullText,
    DateOnlyServerSide,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var UnparticipateStatus = ({ ...additionalKeywords } = {}) => {
    var schema = ParticipationStatus({ ...additionalKeywords });
    
    var _enum = [],
        _enumNames = [];
    for (var [index, it] of schema.enum.entries()) {
        var shouldUse = (
            [
                'canceled-by-participant',
                'canceled-by-institute',
                'deleted-by-institute'
            ].includes(it)
        );
        if (shouldUse) {
            _enum.push(it);
            _enumNames.push(schema.enumNames[index]);
        }
    }

    schema.enum = _enum;
    schema.enumNames = _enumNames;

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
                //lastKnownExperimentEventId: EventId(),
                
                subjectId: ForeignId({
                    collection: 'subject',
                }),
                //lastKnownSubjectScientificEventId: EventId(),

                unparticipateStatus: UnparticipateStatus(),
                //experimentComment: FullText(),
                subjectComment: FullText(),

                blockSubjectFromTesting: {
                    oneOf: [
                        ExactObject({
                            properties: {
                                shouldBlock: DefaultBool({ const: false }),
                            },
                            required: [
                                'shouldBlock'
                            ]
                        }),
                        ExactObject({
                            properties: {
                                shouldBlock: DefaultBool({ const: true, default: true }),
                                blockUntil: DateOnlyServerSide()
                            },
                            required: [
                                'shouldBlock',
                                'blockUntil',
                            ]
                        })
                    ]
                }
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
