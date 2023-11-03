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
    OpenObject,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
    requireify,
    exactlyOneOf,
} = require('@mpieva/psydb-schema-helpers');


var ManualOnlyParticipationSchema = (handlerType) => {
    var required = requireify({
        labMethod: StringEnum(enums.labMethods.keys),
        
        studyId: ForeignId({ collection: 'study' }),
        locationId: ForeignId({ collection: 'location' }),

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
   
    var xor = exactlyOneOf([
        { labTeamId: ForeignId({
            collection: 'experimentOperatorTeam'
        })},
        { labOperatorIds: ForeignIdList({
            collection: 'personnelIds',
            minItems: 1,
        })},
    ])

    return Message({
        type: handlerType,
        payload: OpenObject({
            ...required,
            ...xor
        }),
    });
}

module.exports = { ManualOnlyParticipationSchema }
