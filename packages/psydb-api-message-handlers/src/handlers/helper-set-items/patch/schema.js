'use strict';
var {
    ClosedObject,
    OpenObject,
    MaxObject,
    Id,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = () => (
    Message({
        type: `helperSetItem/patch`,
        payload: ClosedObject({
            id: Id(),
            props: ClosedObject({
                label: SaneString({ minLength: 1 }),
                displayNameI18N: MaxObject({
                    de: SaneString()
                })
            })
        })
    })
)

module.exports = createSchema;
