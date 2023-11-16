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
    exactlyOneOf,
} = require('@mpieva/psydb-schema-helpers');


var OnlineSurveySchema = (handlerType) => {
    var required = requireify({
        labMethod: StringEnum(enums.labMethods.keys),
        
        studyId: ForeignId({ collection: 'study' }),

        subjectData: DefaultArray({
            items: ExactObject(requireify({
                subjectId: ForeignId({ collection: 'subject' }),
                timestamp: DateTime(),
                status: ParticipationStatus(),
                excludeFromMoreExperimentsInStudy: DefaultBool(),
            })),
            minItems: 1,
        }),
    })
   
    return Message({
        type: handlerType,
        payload: ExactObject({
            ...required,
        }),
    });
}

module.exports = { OnlineSurveySchema }
