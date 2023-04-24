'use strict';
var {
    ClosedObject,
    SaneString,
    DefaultBool
} = require('@mpieva/psydb-schema-fields');

var ApiKeyState = (bag = {}) => {
    var { enableInternalProps } = bag;
    
    var schema = ClosedObject({
        label: SaneString({ minLength: 1 }),
        isEnabled: DefaultBool(),
        permissions: { type: 'object' }, // TODO future

        ...(enableInternalProps && {
            internals: ClosedObject({
                isRemoved: DefaultBool(),
            })
        })
    }, { systemType: 'ApiKeyState' });

    return schema;
};

module.exports = ApiKeyState;
