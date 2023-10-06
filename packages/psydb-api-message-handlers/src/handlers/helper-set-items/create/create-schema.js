'use strict';
var {
    ExactObject,
    ClosedObject,
    OpenObject,
    Id,
    ForeignId,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({ op }) => (
    Message({
        type: `helperSetItem/${op}`,
        payload: ExactObject({
            properties: {
                id: Id(),
                setId: ForeignId({ collection: 'helperSet' }),
                props: ClosedObject({
                    label: SaneString({ minLength: 1 }),
                    displayNameI18N: OpenObject({
                        de: SaneString()
                    })
                })
            },
            required: [
                'setId',
                'props'
            ]
        })
    })
)

module.exports = createSchema;
