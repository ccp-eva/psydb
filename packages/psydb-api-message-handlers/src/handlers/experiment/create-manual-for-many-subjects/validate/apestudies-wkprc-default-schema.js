'use strict';
var enums = require('@mpieva/psydb-schema-enums');

var {
    ExactObject,
    DateOnlyServerSide,
    ForeignId,
    DefaultArray,
    DefaultBool,
    ForeignIdList,
    StringEnum,
    ParticipationStatus,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
    requireify,
    exactlyOneOf,
} = require('@mpieva/psydb-schema-helpers');


var ApestudiesWKPRCDefaultSchema = (handlerType) => {
    var required = requireify({
        'labMethod': StringEnum(enums.labMethods.keys),
        
        'studyId': ForeignId({ collection: 'study' }),
        'locationId': ForeignId({ collection: 'location' }),
        'subjectGroupId': ForeignId({ collection: 'subjectGroup' }),

        'subjectData': DefaultArray({
            items: ExactObject(requireify({
                'subjectId': ForeignId({ collection: 'subject' }),
                'timestamp': DateOnlyServerSide(),
                'status': ParticipationStatus(),
                'comment': SaneString(),
                'excludeFromMoreExperimentsInStudy': DefaultBool(),
            })),
            minItems: 1,
        }),

        'roomOrEnclosure': SaneString({ minLength: 1 }),
        'experimentName': SaneString({ minLength: 1 }),

        'labOperatorIds': ForeignIdList({
            collection: 'experimentOperatorIds',
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

module.exports = { ApestudiesWKPRCDefaultSchema }
