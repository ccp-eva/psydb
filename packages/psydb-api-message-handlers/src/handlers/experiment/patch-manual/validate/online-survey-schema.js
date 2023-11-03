'use strict';
var enums = require('@mpieva/psydb-schema-enums');

var {
    ExactObject,
    DateTime,
    ForeignId,
    DefaultArray,
    DefaultBool,
    StringEnum,
    ParticipationStatus,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
    requireify,
} = require('@mpieva/psydb-schema-helpers');


var OnlineSurveySchema = (handlerType) => {
    var { properties, required } = requireify({
        experimentId: ForeignId({ collection: 'experiment' }),
        timestamp: DateTime(),

        subjectData: DefaultArray({
            items: ExactObject(requireify({
                subjectId: ForeignId({ collection: 'subject' }),
                status: ParticipationStatus(),
                excludeFromMoreExperimentsInStudy: DefaultBool(),
            })),
            minItems: 1,
            maxItems: 1, // NOTE: there are no currently group surveys
        })
    })
   
    return Message({
        type: handlerType,
        payload: ExactObject({
            properties,
            required,
        }),
    });
}

module.exports = { OnlineSurveySchema };
