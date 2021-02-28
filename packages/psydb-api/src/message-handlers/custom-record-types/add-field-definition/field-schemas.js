'use strict';
var {
    ExactObject,
    Id,
    EventId,
    IdentifierString,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var FieldDefinition = ({
    type,
    props,
}) => ExactObject({
    properties: {
        key: IdentifierString(),
        type: { const: type },
        props: ExactObject({
            properties: props,
            required: Object.keys(props)
        })
    },
    required: [
        'key',
        'type',
        'props',
    ]
})

var EmailListFieldDefinition = () => FieldDefinition({
    type: 'EmailList',
    props: {
        minItems: {
            type: 'integer',
            minimum: 0
        }
    },
})

var HelperSetItemIdListFieldDefinition = () => FieldDefinition({
    type: 'HelperSetItemIdList',
    props: {
        set: IdentifierString()
    },
})

var ForeignIdFieldDefinition = () => FieldDefinition({
    type: 'ForeignId',
    props: {
        collection: IdentifierString(),
        recordType: IdentifierString(),
        constraints: {
            type: 'object',
            // TODO: { schoolId: { $data: '1/school' }}
        }
    }
})

var AddressFieldDefinition = () => FieldDefinition({
    type: 'Address',
    props: {},
});

var SaneStringFieldDefinition = () => FieldDefinition({
    type: 'SaneString',
    props: {},
});

var FullTextFieldDefinition = () => FieldDefinition({
    type: 'FullText',
    props: {},
});

// to make sure the paths match the real message structure
var wrapped = (definition) => () => ({
    type: 'object',
    properties: {
        payload: {
            type: 'object',
            properties: {
                props: definition(),
            }
        }
    }
})

module.exports = {
    SaneString: wrapped(SaneStringFieldDefinition),
    FullText: wrapped(FullTextFieldDefinition),
    Address: wrapped(AddressFieldDefinition),
    EmailList: wrapped(EmailListFieldDefinition),
    HelperSetItemIdList: wrapped(HelperSetItemIdListFieldDefinition),
    ForeignId: wrapped(ForeignIdFieldDefinition),
}
