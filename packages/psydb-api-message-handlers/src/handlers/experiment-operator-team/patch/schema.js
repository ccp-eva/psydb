'use strict';
var {
    ExactObject,
    OpenObject,
    Id,
    Color,
    DefaultBool,
    ForeignId,
    ForeignIdList,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');


var Core = (bag) => {
    var { messageType } = bag;
    return Message({
        type: messageType,
        payload: OpenObject({
            properties: { id: Id() },
            required: [ 'id' ]
        })
    })
};

var Full = (bag) => {
    var { messageType, hasExperiments } = bag;

    return Message({
        type: messageType,
        payload: ExactObject({
            properties: {
                id: Id(),
                props: ExactObject({
                    properties: {
                        color: Color(),
                        hidden: DefaultBool(),

                        ...(!hasExperiments && ({
                            researchGroupId: ForeignId({
                                collection: 'researchGroupId',
                            }),

                            personnelIds: ForeignIdList({
                                collection: 'personnel',
                                minItems: 1,
                            })
                        }))
                    },
                    required: [
                        'color',
                        'hidden',
                        !hasExperiments && 'personnelIds'
                    ].filter(it => !!it)
                })
            },
            required: [ 'id', 'props' ]
        })
    })
}

module.exports = {
    Core,
    Full
};
