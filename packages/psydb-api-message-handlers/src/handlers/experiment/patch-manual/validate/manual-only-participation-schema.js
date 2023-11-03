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
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
    requireify,
} = require('@mpieva/psydb-schema-helpers');


var ManualOnlyParticipationSchema = (handlerType) => {
    var { properties, required } = requireify({
        experimentId: ForeignId({ collection: 'experiment' }),
        timestamp: DateTime(), // FIXME: date only server side?
        locationId: ForeignId({ collection: 'location' }),

        subjectData: DefaultArray({
            items: ExactObject(requireify({
                subjectId: ForeignId({ collection: 'subject' }),
                status: ParticipationStatus(),
                excludeFromMoreExperimentsInStudy: DefaultBool(),
            })),
            minItems: 1,
        }),
        labOperatorIds: ForeignIdList({
            collection: 'personnelIds',
            minItems: 1,
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

module.exports = { ManualOnlyParticipationSchema }
