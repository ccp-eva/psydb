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
    Integer,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
    requireify,
    exactlyOneOf,
} = require('@mpieva/psydb-schema-helpers');


var ApestudiesWKPRCDefaultSchema = (handlerType) => {
    var required = requireify({
        labMethod: StringEnum(enums.labMethods.keys),
        
        timestamp: DateOnlyServerSide(),
        studyId: ForeignId({ collection: 'study' }),
        locationId: ForeignId({ collection: 'location' }),
        subjectGroupId: ForeignId({ collection: 'subjectGroup' }),

        subjectData: DefaultArray({
            items: ExactObject(requireify({
                subjectId: ForeignId({ collection: 'subject' }),
                role: SaneString({ minLength: 1 }),
                status: ParticipationStatus(),
                comment: SaneString(),
                excludeFromMoreExperimentsInStudy: DefaultBool(),
            })),
            minItems: 1,
        }),

        roomOrEnclosure: SaneString({ minLength: 1 }),
        experimentName: SaneString({ minLength: 1 }),
        intradaySeqNumber: Integer({ minimum: 1 }),
        totalSubjectCount: Integer({ minimum: 1 }),

        labOperatorIds: ForeignIdList({
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
