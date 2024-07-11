'use strict';
var enums = require('@mpieva/psydb-schema-enums');

var {
    ExactObject,
    DateTime,
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
} = require('@mpieva/psydb-schema-helpers');


var ApestudiesWKPRCDefaultSchema = (handlerType) => {
    var { properties, required } = requireify({
        experimentId: ForeignId({ collection: 'experiment' }),
        
        timestamp: DateTime(), // FIXME: date only server side?
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
            //maxItems: 1, // NOTE: no multi subject experiments (ask wkprc)
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
            properties,
            required,
        }),
    });
}

module.exports = { ApestudiesWKPRCDefaultSchema }
