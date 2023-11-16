'use strict';
var enums = require('@mpieva/psydb-schema-enums');

var {
    ExactObject,
    OpenObject,
    DateTime,
    ForeignId,
    DefaultArray,
    DefaultBool,
    ForeignIdList,
    StringEnum,
    ParticipationStatus,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
    requireify,
    exactlyOneOf,
} = require('@mpieva/psydb-schema-helpers');


var AwayTeamSchema = (handlerType) => {
    var required = requireify({
        labMethod: StringEnum(enums.labMethods.keys),
        
        timestamp: DateTime(),
        studyId: ForeignId({ collection: 'study' }),
        locationId: ForeignId({ collection: 'location' }),

        subjectData: DefaultArray({
            items: ExactObject(requireify({
                subjectId: ForeignId({ collection: 'subject' }),
                status: ParticipationStatus(),
                excludeFromMoreExperimentsInStudy: DefaultBool(),
            })),
            minItems: 1,
        })
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
        payload: OpenObject({ // NOTE: xor requires open
            ...required,
            ...xor
        }),
    });
}

module.exports = { AwayTeamSchema };
