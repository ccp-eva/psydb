'use strict';
var {
    ExactObject,
    ClosedObject,
    OpenObject,
    Id,
    StringEnum,
    IdentifierString,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');
var { FieldDefinitionSchemas } = require('@mpieva/psydb-common-lib');

var FieldType = () => StringEnum([
    ...Object.keys(FieldDefinitionSchemas)
]);

var SubChannelKey = () => (
    StringEnum([ 'scientific', 'gdpr' ])
);

var PayloadProps = () => {
    return ClosedObject({
        'key': IdentifierString({ minLength: 1 }),
        'type': FieldType(),
        'displayName': SaneString({ minLength: 1 }),
        'displayNameI18N': OpenObject({
            'de': SaneString()
        }),
        'props': OpenObject({})
    })
}

var Schema = () => {
    var required = {
        'id': Id(),
        'props': PayloadProps()
    }

    var optional = {
        'subChannelKey': SubChannelKey(),
    }

    return Message({
        type: `custom-record-types/add-field-definition`,
        payload: ExactObject({
            properties: { ...required, ...optional },
            required: Object.keys(required)
        })
    });
}

module.exports = Schema;
