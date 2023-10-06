'use strict';
var {
    ExactObject,
    ClosedObject,
    MaxObject,
    Id,
    ForeignId,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = () => (
    Message({
        type: `helperSetItem/create`,
        payload: ExactObject({
            properties: {
                id: Id(),
                setId: ForeignId({ collection: 'helperSet' }),
                props: ClosedObject({
                    label: SaneString({ minLength: 1 }),
                    displayNameI18N: MaxObject({
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
